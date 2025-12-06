"""
seed_db.py
Integrates validator.py CSV outputs into Supabase.
Requires: pip install supabase pandas shapely
"""

import pandas as pd
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import json
import random

# Load Environment Variables
load_dotenv()
url = os.environ.get("SUPABASE_URL")
# MUST use SERVICE_ROLE_KEY to bypass RLS and create users
key = os.environ.get("SUPABASE_SERVICE_KEY") 

supabase: Client = create_client(url, key)

# --- CONFIGURATION ---
BUCHAREST_COORDS = {
    "Sector 1": "POLYGON((26.0 44.5, 26.1 44.5, 26.1 44.4, 26.0 44.4, 26.0 44.5))",
    "Sector 2": "POLYGON((26.1 44.5, 26.2 44.5, 26.2 44.4, 26.1 44.4, 26.1 44.5))",
    "Sector 3": "POLYGON((26.1 44.4, 26.2 44.4, 26.2 44.3, 26.1 44.3, 26.1 44.4))",
    "Sector 4": "POLYGON((26.0 44.3, 26.1 44.3, 26.1 44.4, 26.0 44.4, 26.0 44.3))",
    "Sector 5": "POLYGON((25.9 44.3, 26.0 44.3, 26.0 44.4, 25.9 44.4, 25.9 44.3))",
    "Sector 6": "POLYGON((25.9 44.4, 26.0 44.4, 26.0 44.5, 25.9 44.5, 25.9 44.4))"
}

def generate_random_point(sector_name):
    # Simplified logic: Returns a point near Bucharest center
    # In production, use Shapely to generate a point INSIDE the sector polygon
    lat = 44.4268 + random.uniform(-0.05, 0.05)
    long = 26.1025 + random.uniform(-0.05, 0.05)
    return f"POINT({long} {lat})"

def seed_data():
    print("--- STARTING DB SEED ---")

    # 1. LOAD CSV DATA
    print("Loading CSV files...")
    logs_df = pd.read_csv("patient_logs_data.csv")
    air_df = pd.read_csv("air_quality_data.csv")
    labs_df = pd.read_csv("lab_results_data.csv")
    apps_df = pd.read_csv("appointments_data.csv")

    # 2. CREATE USERS & PROFILES
    # Extract unique "PAT-..." IDs from the logs
    unique_patients = logs_df['patient_id'].unique()
    patient_map = {} # Maps "PAT-123" -> "Valid-UUID"

    print(f"Creating {len(unique_patients)} synthetic users in Supabase Auth...")
    
    for pat_str in unique_patients:
        # Create a fake email for the user
        fake_email = f"{pat_str.lower()}@synthetic.test"
        
        # Create user via Admin API (requires Service Role Key)
        user = supabase.auth.admin.create_user({
            "email": fake_email,
            "password": "password123",
            "email_confirm": True
        })
        
        real_uuid = user.user.id
        patient_map[pat_str] = real_uuid

        # Insert into PROFILES
        supabase.table("profiles").upsert({
            "id": real_uuid,
            "full_name": f"Synthetic User {pat_str}",
            "sector": random.choice(list(BUCHAREST_COORDS.keys()))
        }).execute()
    
    print("✓ Users and Profiles created.")

    # 3. INSERT AIR QUALITY
    print("Inserting Air Quality Data...")
    air_records = []
    for _, row in air_df.iterrows():
        sector = row['location']
        # Map generated "location" to a PostGIS Polygon
        wkt_polygon = BUCHAREST_COORDS.get(sector, BUCHAREST_COORDS["Sector 1"])
        
        air_records.append({
            "sector_name": sector,
            "pm25": row['pm25'],
            "pm10": row['pm10'],
            "boundary": wkt_polygon, # PostGIS will parse this WKT string
            "last_updated": row['timestamp']
        })
    # Batch insert
    supabase.table("air_quality").insert(air_records).execute()
    print("✓ Air Quality inserted.")

    # 4. INSERT PATIENT LOGS
    print("Inserting Patient Logs...")
    log_records = []
    for _, row in logs_df.iterrows():
        if row['patient_id'] in patient_map:
            log_records.append({
                "user_id": patient_map[row['patient_id']], # Use the REAL UUID
                "symptom_text": row['symptom_text'],
                "severity_score": row['severity_score'],
                "log_location": generate_random_point("Sector 1"), # Convert to Point
                "created_at": row['timestamp']
            })
    
    # Insert in chunks of 100 to avoid timeouts
    for i in range(0, len(log_records), 100):
        supabase.table("patient_logs").insert(log_records[i:i+100]).execute()
    print("✓ Patient Logs inserted.")

    # 5. INSERT LABS & APPOINTMENTS
    print("Inserting Labs & Appointments...")
    
    lab_records = []
    for _, row in labs_df.iterrows():
        # Only insert if we have a mapped user
        # Note: Your script generates random PAT IDs for labs, 
        # they might not match the PAT IDs in logs. 
        # For this script, we check if the PAT ID exists in our map.
        # If not, we skip (or you'd need to create users for them too).
        real_uid = patient_map.get(row['patient_id'])
        if real_uid:
            lab_records.append({
                "id": row['lab_result_id'], # "GP-..."
                "patient_id": real_uid,
                "test_name": row['test_name'],
                "result_value": row['result_value'],
                "reference_range": row['reference_range'],
                "branch_code": row['branch_code'],
                "created_at": row['timestamp']
            })
            
    if lab_records:
        supabase.table("lab_results").insert(lab_records).execute()
    
    print("✓ Database Seed Complete.")

if __name__ == "__main__":
    seed_data()