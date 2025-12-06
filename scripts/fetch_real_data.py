import os
import requests
import json
from dotenv import load_dotenv
from supabase import create_client
import random
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import binascii

# Load env
from pathlib import Path
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)
OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
ENCRYPTION_KEY_HEX = os.getenv("DATA_ENCRYPTION_KEY")

if not all([OPENAQ_API_KEY, SUPABASE_URL, SUPABASE_KEY, ENCRYPTION_KEY_HEX]):
    print("Error: Missing API keys or Encryption Key.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def encrypt_text(text):
    key = binascii.unhexlify(ENCRYPTION_KEY_HEX)
    iv = os.urandom(12) # 96-bit IV for GCM
    encryptor = Cipher(
        algorithms.AES(key),
        modes.GCM(iv),
        backend=default_backend()
    ).encryptor()
    
    ciphertext = encryptor.update(text.encode()) + encryptor.finalize()
    
    # Format: iv:ciphertext:tag (all hex)
    return f"{binascii.hexlify(iv).decode()}:{binascii.hexlify(ciphertext).decode()}:{binascii.hexlify(encryptor.tag).decode()}"


def fetch_openaq_data():
    print("Fetching real-time data from OpenAQ...")
    url = "https://api.openaq.org/v3/locations"
    
    # Bucharest Center
    lat = 44.4268
    lon = 26.1025
    radius = 25000 # 25km
    
    headers = {
        "X-API-Key": OPENAQ_API_KEY,
        "Accept": "application/json"
    }
    
    params = {
        "coordinates": f"{lat},{lon}",
        "radius": radius,
        "limit": 100
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])
    except Exception as e:
        print(f"Error fetching OpenAQ: {e}")
        return []

def get_latest_measurement(location_id, parameter):
    # Fetch latest measurement for a specific parameter at a location
    url = f"https://api.openaq.org/v3/locations/{location_id}/sensors"
    headers = {"X-API-Key": OPENAQ_API_KEY}
    
    try:
        res = requests.get(url, headers=headers)
        res.raise_for_status()
        sensors = res.json().get("results", [])
        
        for s in sensors:
            if s["parameter"]["name"] == parameter:
                # In v3, we might need to fetch the latest measurement separately or it's in the sensor object
                # Actually v3 has a /measurements endpoint or latest endpoint.
                # Let's try to get the latest value from the sensor object if available, 
                # or query the measurements endpoint.
                # Simplified: OpenAQ v3 sensor object often has 'latest' field.
                # Let's check the structure in the main loop instead.
                pass
        return None
    except:
        return None

def update_db_with_real_data(stations):
    print(f"Found {len(stations)} stations. Updating Database...")
    
    # Clear existing synthetic air quality data? 
    # Maybe we keep it for sectors where we don't have stations, but for now let's just add stations.
    # Actually, to make the map look good, we might want to replace the big sectors with these station points (buffered).
    
    # Let's truncate air_quality to remove synthetic data
    try:
        supabase.table("air_quality").delete().neq("id", 0).execute()
    except:
        pass

    count = 0
    for station in stations:
        name = station["name"]
        lat = station["coordinates"]["latitude"]
        lon = station["coordinates"]["longitude"]
        
        # Extract PM2.5 and PM10
        pm25 = 0.0
        pm10 = 0.0
        
        # In OpenAQ v3, 'sensors' list is inside the location object
        # But it DOES NOT contain the latest value directly. We must fetch it.
        # To avoid N+1 requests, we can try to use the 'latest' endpoint or just fetch sensors for active ones.
        # Actually, the 'locations' endpoint doesn't return measurements.
        # We need to query the 'latest' endpoint for this location or generally for the area.
        
        # Strategy: Use the /sensors/latest endpoint? Or /locations/{id}/sensors which might have it?
        # The debug output showed 'sensors' list but NO 'latest' field inside.
        # So we must fetch measurements separately.
        
        # Let's try to fetch latest measurements for this location ID.
        try:
            # OpenAQ v3 latest endpoint is /locations/{id}/sensors/{sensor_id}/measurements?limit=1
            # OR /sensors/{id}/measurements
            # But we need to know sensor IDs.
            # The 'sensors' list in the station object HAS IDs.
            
            for sensor in station.get("sensors", []):
                s_id = sensor["id"]
                p_name = sensor["parameter"]["name"]
                
                if p_name not in ["pm25", "pm10"]:
                    continue
                    
                # Fetch latest measurement for this sensor
                m_url = f"https://api.openaq.org/v3/sensors/{s_id}/measurements"
                headers = {"X-API-Key": OPENAQ_API_KEY}
                m_params = {"limit": 1}
                
                m_res = requests.get(m_url, headers=headers, params=m_params, timeout=2)
                if m_res.status_code == 200:
                    m_data = m_res.json().get("results", [])
                    if m_data:
                        val = m_data[0].get("value", 0)
                        if p_name == "pm25":
                            pm25 = val
                        elif p_name == "pm10":
                            pm10 = val
                            
        except Exception as e:
            print(f"  Error fetching latest for {name}: {e}")

        # If no data, skip or simulate based on nearby?

        # Let's simulate if missing to ensure we have data points, 
        # but mark it. Or just skip.
        if pm25 == 0 and pm10 == 0:
            continue

        # Create a small polygon (buffer) around the point so it shows up on the map
        # 0.01 degrees is roughly 1km
        buffer = 0.015
        wkt_polygon = f"POLYGON(({lon-buffer} {lat-buffer}, {lon+buffer} {lat-buffer}, {lon+buffer} {lat+buffer}, {lon-buffer} {lat+buffer}, {lon-buffer} {lat-buffer}))"
        
        data = {
            "sector_name": f"{name} (Station)",
            "pm25": pm25,
            "pm10": pm10,
            "boundary": wkt_polygon,
            "last_updated": "now()"
        }
        
        supabase.table("air_quality").insert(data).execute()
        count += 1
        
    print(f"Successfully inserted {count} real stations into DB.")
    return count

def generate_synthetic_people_near_stations(stations):
    print("Generating synthetic patients based on real pollution data...")
    
    # We need to fetch the inserted stations from DB to get their IDs or just use the loop
    # Let's generate 5 people per active station
    
    patients = []
    
    for station in stations:
        # Check if station had data (same logic as above)
        # We need to re-fetch or store the data we just fetched.
        # Since we didn't store it in the 'stations' list in the previous function, let's just query the DB
        # to find active stations we just inserted.
        pass
    
    # Fetch active stations from DB
    try:
        res = supabase.table("air_quality").select("*").execute()
        active_stations = res.data
    except:
        return

    for station in active_stations:
        pm25 = station['pm25']
        
        if pm25 == 0: continue
        
        # Determine symptoms based on REAL PM2.5
        symptoms = []
        severity = 1
        
        if pm25 < 10:
            symptoms = ["Feeling great", "No issues", "Enjoying the fresh air"]
            severity = 1
        elif pm25 < 25:
            symptoms = ["Slight throat irritation", "Mild coughing", "Watery eyes"]
            severity = 3
        elif pm25 < 50:
            symptoms = ["Persistent cough", "Shortness of breath", "Wheezing", "Headache"]
            severity = 6
        else:
            symptoms = ["Severe asthma attack", "Chest pain", "Extreme dizziness", "Difficulty breathing"]
            severity = 9
            
        # Generate 3-5 people per station
        for _ in range(random.randint(3, 5)):
            # Random location near station (parse WKT or just use center if we had it)
            # We stored WKT Polygon. Let's just approximate from the boundary string or fetch center.
            # Simplified: We don't have the center easily available here unless we parse WKT.
            # Let's just use a random point in Bucharest for now, or better, parse the WKT.
            # WKT: POLYGON((lon lat, ...))
            try:
                # Extract first coordinate pair from WKT
                wkt = station['boundary']
                first_pair = wkt.split("((")[1].split(",")[0]
                lon_str, lat_str = first_pair.split(" ")
                center_lon = float(lon_str) + 0.015 # Offset back to center roughly
                center_lat = float(lat_str) + 0.015
                
                lat = center_lat + random.uniform(-0.01, 0.01)
                lon = center_lon + random.uniform(-0.01, 0.01)
            except:
                lat = 44.4268
                lon = 26.1025
            
            # Create Profile (User)
            # Note: In a real script we'd create Auth users, but here we might just insert logs 
            # linked to a placeholder profile if we don't want to spam Auth.
            # For this demo, let's assume we have a 'demo_user' or create one.
            
            # Actually, let's just print what we WOULD do, or insert into patient_logs if we have a valid user_id.
            # To make this runnable without creating 100 auth users, let's pick one existing user ID from profiles.
            
            try:
                user_id = supabase.table("profiles").select("id").limit(1).execute().data[0]['id']
                
                symptom_raw = f"{random.choice(symptoms)}. Located near {station['sector_name']}."
                symptom_encrypted = encrypt_text(symptom_raw)
                
                log = {
                    "user_id": user_id,
                    "symptom_text": symptom_encrypted,
                    "severity_score": severity,
                    "log_location": f"POINT({lon} {lat})"
                }
                supabase.table("patient_logs").insert(log).execute()
            except Exception as e:
                print(f"Skipping log generation: {e}")
                break
                
    print("Synthetic patient logs generated.")

if __name__ == "__main__":
    stations = fetch_openaq_data()
    if stations:
        active_count = update_db_with_real_data(stations)
        if active_count > 0:
            generate_synthetic_people_near_stations(stations)
    else:
        print("No stations found.")
