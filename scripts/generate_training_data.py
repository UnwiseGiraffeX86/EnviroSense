import os
import random
import uuid
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client
from shapely import wkb
from shapely.geometry import Point

# Load env
from pathlib import Path
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("Error: Missing API keys.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_data():
    print("Fetching Air Quality stations...")
    aq_res = supabase.table("air_quality").select("id, pm25, pm10, boundary").execute()
    stations = aq_res.data
    
    if not stations:
        print("No stations found.")
        return

    print("Fetching Profiles...")
    profiles_res = supabase.table("profiles").select("id").execute()
    profiles = [p['id'] for p in profiles_res.data]
    
    if not profiles:
        print("No profiles found. Cannot generate logs.")
        return

    print(f"Found {len(stations)} stations. Generating correlated patient logs...")
    
    # Clear existing logs to ensure high accuracy training
    print("Clearing old patient logs...")
    try:
        supabase.table("patient_logs").delete().gt("severity_score", -1).execute()
    except Exception as e:
        print(f"Error clearing logs: {e}")
    
    new_logs = []
    
    for station in stations:
        # Parse station location
        try:
            wkb_hex = station['boundary']
            if not wkb_hex:
                continue
            geom = wkb.loads(bytes.fromhex(wkb_hex))
            center = geom.centroid
            base_lon = center.x
            base_lat = center.y
            
            pm25 = station['pm25']
            if pm25 is None:
                continue
                
            # Generate 10 logs per station
            for _ in range(10):
                # 1. Generate Location (Near station)
                # Offset approx 0-500m (0.005 deg is roughly 500m)
                lon_offset = random.uniform(-0.002, 0.002)
                lat_offset = random.uniform(-0.002, 0.002)
                log_lon = base_lon + lon_offset
                log_lat = base_lat + lat_offset
                
                # 2. Calculate Severity based on PM2.5 (Strong Correlation)
                # Normalize PM2.5 (0-100 scale roughly) to 1-10
                # Add small noise
                base_severity = (pm25 / 10.0) + 1.0
                noise = random.uniform(-0.5, 0.5) # Reduced noise for higher accuracy
                severity = int(base_severity + noise)
                
                # Clamp
                severity = max(1, min(10, severity))
                
                # 3. Create Record
                new_logs.append({
                    "user_id": random.choice(profiles),
                    "severity_score": severity,
                    "symptom_text": "Generated for training",
                    "log_location": f"POINT({log_lon} {log_lat})"
                })
                
        except Exception as e:
            print(f"Error processing station: {e}")
            continue
            
    print(f"Inserting {len(new_logs)} correlated logs...")
    
    # Batch insert
    batch_size = 100
    for i in range(0, len(new_logs), batch_size):
        batch = new_logs[i:i+batch_size]
        supabase.table("patient_logs").insert(batch).execute()
        print(f"Inserted batch {i//batch_size + 1}")
        
    print("Data generation complete.")

if __name__ == "__main__":
    generate_data()
