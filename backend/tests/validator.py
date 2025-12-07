import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib
import warnings
from shapely import wkb
import binascii
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

# Suppress warnings
warnings.filterwarnings("ignore")

# Load env
from pathlib import Path
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
ENCRYPTION_KEY_HEX = os.getenv("DATA_ENCRYPTION_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, ENCRYPTION_KEY_HEX]):
    print("Error: Missing API keys.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ==============================================================================
# SECURITY: DECRYPTION LOGIC
# ==============================================================================
def decrypt_text(encrypted_text):
    if not encrypted_text: return None
    try:
        key = binascii.unhexlify(ENCRYPTION_KEY_HEX)
        parts = encrypted_text.split(':')
        iv = binascii.unhexlify(parts[0])
        ciphertext = binascii.unhexlify(parts[1])
        tag = binascii.unhexlify(parts[2])
        
        decryptor = Cipher(
            algorithms.AES(key),
            modes.GCM(iv, tag),
            backend=default_backend()
        ).decryptor()
        
        decrypted_bytes = decryptor.update(ciphertext) + decryptor.finalize()
        return decrypted_bytes.decode('utf-8')
    except Exception as e:
        # print(f"Decryption error: {e}")
        return None

# ==============================================================================
# DATA FETCHING
# ==============================================================================

def fetch_weather_history():
    print("Fetching Weather History...")
    # Fetching last 1000 records for efficiency in this demo
    # In prod, you'd query by range
    res = supabase.table("weather_history").select("*").order("timestamp", desc=True).limit(5000).execute()
    df = pd.DataFrame(res.data)
    if not df.empty:
        df['timestamp'] = pd.to_datetime(df['timestamp'])
    return df

def fetch_medical_profiles():
    print("Fetching and Decrypting Medical Profiles...")
    res = supabase.table("medical_profiles").select("*").execute()
    profiles = {}
    
    for r in res.data:
        try:
            uid = r['user_id']
            
            # Decrypt fields
            dob_str = decrypt_text(r['encrypted_dob'])
            gender = decrypt_text(r['encrypted_gender'])
            height = float(decrypt_text(r['encrypted_height_cm']) or 0)
            weight = float(decrypt_text(r['encrypted_weight_kg']) or 0)
            conditions_json = decrypt_text(r['encrypted_existing_conditions'])
            
            # Feature Engineering
            age = 0
            if dob_str:
                dob = datetime.fromisoformat(dob_str)
                age = (datetime.now() - dob).days / 365.25
                
            bmi = 0
            if height > 0 and weight > 0:
                bmi = weight / ((height/100)**2)
                
            has_asthma = 0
            if conditions_json:
                conditions = json.loads(conditions_json)
                if "Asthma" in conditions:
                    has_asthma = 1
            
            profiles[uid] = {
                "age": age,
                "is_male": 1 if gender == "Male" else 0,
                "bmi": bmi,
                "has_asthma": has_asthma
            }
        except Exception as e:
            continue
            
    return profiles

def fetch_training_data():
    print("Fetching data from Supabase...")
    
    # 1. Fetch Air Quality (Spatial Features)
    aq_res = supabase.table("air_quality").select("sector_name, pm25, pm10, boundary").execute()
    aq_df = pd.DataFrame(aq_res.data)
    
    # 2. Fetch Patient Logs (Target)
    # Need created_at for weather matching, user_id for profile matching
    logs_res = supabase.table("patient_logs").select("severity_score, log_location, created_at, user_id").limit(500).execute()
    logs_data = logs_res.data
    
    # 3. Fetch Context Data
    weather_df = fetch_weather_history()
    medical_profiles = fetch_medical_profiles()
    
    if not logs_data:
        print("No patient logs found.")
        return None

    dataset = []
    
    # Pre-calculate station centers
    stations = []
    for _, row in aq_df.iterrows():
        try:
            wkb_hex = row['boundary']
            if not wkb_hex: continue
            geom = wkb.loads(bytes.fromhex(wkb_hex))
            centroid = geom.centroid
            stations.append({
                "pm25": row['pm25'],
                "pm10": row['pm10'],
                "lat": centroid.y,
                "lon": centroid.x
            })
        except: continue
            
    print(f"Linking {len(logs_data)} logs with Weather, AQ, and Medical History...")

    for log in logs_data:
        try:
            # 1. Parse Location
            wkb_hex = log['log_location']
            if not wkb_hex: continue
            
            if wkb_hex.startswith("POINT"):
                p_inner = wkb_hex.split("(")[1].split(")")[0]
                lon, lat = map(float, p_inner.split(" "))
            else:
                geom = wkb.loads(bytes.fromhex(wkb_hex))
                lon, lat = geom.x, geom.y
            
            # 2. Find Nearest AQ Station
            nearest_aq = None
            min_dist = float('inf')
            for s in stations:
                dist = (s['lat'] - lat)**2 + (s['lon'] - lon)**2
                if dist < min_dist:
                    min_dist = dist
                    nearest_aq = s
            
            if not nearest_aq: continue

            # 3. Find Nearest Weather (Temporal)
            # Simple approach: Find weather record closest in time
            # In prod: also match location
            log_time = pd.to_datetime(log['created_at'])
            
            # Filter weather to reasonable window (e.g. +/- 1 hour) if dataset is huge
            # For now, just find absolute nearest in the fetched buffer
            if not weather_df.empty:
                # Calculate time difference
                # Ensure timezone awareness compatibility
                if weather_df['timestamp'].dt.tz is None:
                    weather_df['timestamp'] = weather_df['timestamp'].dt.tz_localize('UTC')
                if log_time.tz is None:
                    log_time = log_time.tz_localize('UTC')
                
                time_diffs = abs(weather_df['timestamp'] - log_time)
                nearest_weather_idx = time_diffs.idxmin()
                weather_rec = weather_df.iloc[nearest_weather_idx]
                
                # If diff is too large (> 24 hours), ignore weather or set to null/avg
                # Here we assume data is dense enough
                temp = weather_rec['temperature_2m']
                humidity = weather_rec['relative_humidity_2m']
                pressure = weather_rec['surface_pressure']
            else:
                temp, humidity, pressure = 20, 50, 1013 # Defaults
            
            # 4. Find Medical Profile
            user_id = log.get('user_id')
            profile = medical_profiles.get(user_id, {
                "age": 35, "is_male": 0, "bmi": 24, "has_asthma": 0
            })
            
            # 5. Construct Feature Vector
            dataset.append({
                # Environmental
                "pm25": nearest_aq['pm25'],
                "pm10": nearest_aq['pm10'],
                "temperature": temp,
                "humidity": humidity,
                "pressure": pressure,
                
                # Personal
                "age": profile['age'],
                "is_male": profile['is_male'],
                "bmi": profile['bmi'],
                "has_asthma": profile['has_asthma'],
                
                # Target
                "severity": log['severity_score']
            })
        except Exception as e:
            # print(f"Skipping log: {e}")
            continue
            
    return pd.DataFrame(dataset)

def train_model():
    df = fetch_training_data()
    if df is None or df.empty:
        print("Insufficient data for training.")
        return

    print(f"Training on {len(df)} records with extended features...")
    print("Features: PM2.5, PM10, Temp, Humidity, Pressure, Age, Gender, BMI, Asthma")
    
    features = ['pm25', 'pm10', 'temperature', 'humidity', 'pressure', 'age', 'is_male', 'bmi', 'has_asthma']
    X = df[features]
    y = df['severity']
    
    if len(df) < 5:
        print("Not enough data to split. Training on full set.")
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        mse = 0.0
    else:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        predictions = model.predict(X_test)
        mse = mean_squared_error(y_test, predictions)
    
    print("------------------------------------------------")
    print(f"Model Trained Successfully.")
    print(f"Mean Squared Error (MSE): {mse:.4f}")
    print("------------------------------------------------")
    
    # Test Prediction
    # Scenario: High Pollution, Cold Day, Asthmatic Patient
    test_vector = [[
        45,   # PM2.5
        50,   # PM10
        5.0,  # Temp (C)
        80,   # Humidity (%)
        1010, # Pressure
        45,   # Age
        1,    # Male
        28.5, # BMI
        1     # Has Asthma
    ]]
    pred = model.predict(test_vector)[0]
    print(f"Test Prediction (High Pollution + Asthma): Severity {pred:.2f}/10")
    
    # Serialize
    joblib.dump(model, 'symptom_severity_model.pkl')
    print("Model saved to 'symptom_severity_model.pkl'")

if __name__ == "__main__":
    train_model()
