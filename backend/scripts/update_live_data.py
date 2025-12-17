import os
import time
import requests
import json
from dotenv import load_dotenv
from supabase import create_client
from pathlib import Path
import datetime

# Load environment variables
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([OPENAQ_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    print("Error: Missing API keys. Please check your .env file.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Bucharest Coordinates
LAT = 44.4268
LON = 26.1025
RADIUS = 25000 # 25km

def get_openaq_locations():
    url = "https://api.openaq.org/v3/locations"
    headers = {
        "X-API-Key": OPENAQ_API_KEY,
        "Accept": "application/json"
    }
    params = {
        "coordinates": f"{LAT},{LON}",
        "radius": RADIUS,
        "limit": 100
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        return response.json().get("results", [])
    except Exception as e:
        print(f"Error fetching locations: {e}")
        return []

def get_latest_measurement(sensor_id):
    url = f"https://api.openaq.org/v3/sensors/{sensor_id}/measurements"
    headers = {
        "X-API-Key": OPENAQ_API_KEY,
        "Accept": "application/json"
    }
    params = {
        "limit": 1
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=5)
        response.raise_for_status()
        results = response.json().get("results", [])
        if results:
            return results[0].get("value", 0)
        return 0
    except Exception as e:
        # print(f"Error fetching measurement for sensor {sensor_id}: {e}")
        return 0

def fetch_open_meteo(lat, lon):
    url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "pm10,pm2_5"
    }
    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        current = data.get("current", {})
        return current.get("pm2_5", 0), current.get("pm10", 0)
    except Exception as e:
        print(f"  OpenMeteo error: {e}")
        return 0, 0

def update_station_data(station):
    name = station.get("name", "Unknown Station")
    station_id = station.get("id")
    coords = station.get("coordinates", {})
    lat = coords.get("latitude")
    lon = coords.get("longitude")
    
    if not lat or not lon:
        return

    print(f"Processing {name} (ID: {station_id})...")

    pm25 = 0.0
    pm10 = 0.0
    
    # Iterate through sensors to find PM2.5 and PM10
    sensors = station.get("sensors", [])
    for sensor in sensors:
        parameter = sensor.get("parameter", {})
        if isinstance(parameter, dict):
            param_name = parameter.get("name", "")
        else:
            param_name = str(parameter)
            
        param_clean = param_name.lower().replace(".", "").replace(" ", "")
        sensor_id = sensor.get("id")
        
        if param_clean == "pm25":
            val = get_latest_measurement(sensor_id)
            if val > 0: pm25 = val
        elif param_clean == "pm10":
            val = get_latest_measurement(sensor_id)
            if val > 0: pm10 = val
            
    # If we still have 0s, maybe this station is inactive for these pollutants
    if pm25 == 0 and pm10 == 0:
        print(f"  No OpenAQ data for {name}, trying Open-Meteo...")
        om_pm25, om_pm10 = fetch_open_meteo(lat, lon)
        if om_pm25 > 0: pm25 = om_pm25
        if om_pm10 > 0: pm10 = om_pm10

    if pm25 == 0 and pm10 == 0:
        print(f"  Skipping {name} - No recent PM2.5/PM10 data.")
        return

    # Create WKT Polygon (Buffer)
    buffer = 0.015 # ~1.5km
    wkt_polygon = f"POLYGON(({lon-buffer} {lat-buffer}, {lon+buffer} {lat-buffer}, {lon+buffer} {lat+buffer}, {lon-buffer} {lat+buffer}, {lon-buffer} {lat-buffer}))"
    
    sector_name = f"{name} (Station)"
    
    data = {
        "sector_name": sector_name,
        "pm25": pm25,
        "pm10": pm10,
        "boundary": wkt_polygon,
        "last_updated": datetime.datetime.now().isoformat()
    }
    
    # Upsert into Supabase
    try:
        # Check if exists
        res = supabase.table("air_quality").select("id").eq("sector_name", sector_name).execute()
        if res.data:
            # Update
            supabase.table("air_quality").update(data).eq("id", res.data[0]['id']).execute()
            print(f"  Updated {sector_name}: PM2.5={pm25}, PM10={pm10}")
        else:
            # Insert
            supabase.table("air_quality").insert(data).execute()
            print(f"  Inserted {sector_name}: PM2.5={pm25}, PM10={pm10}")
            
    except Exception as e:
        print(f"  Error updating DB for {sector_name}: {e}")

def main():
    print("Starting Air Quality Update Service...")
    
    # Cleanup zero-value records
    try:
        print("Cleaning up invalid data (PM2.5 = 0)...")
        supabase.table("air_quality").delete().eq("pm25", 0).execute()
    except Exception as e:
        print(f"Cleanup warning: {e}")

    print("Press Ctrl+C to stop.")
    
    while True:
        print(f"\n--- Fetching Data at {datetime.datetime.now()} ---")
        locations = get_openaq_locations()
        print(f"Found {len(locations)} locations.")
        
        for loc in locations:
            update_station_data(loc)
            
        print("Update complete. Waiting 10 minutes...")
        time.sleep(600) # 10 minutes

if __name__ == "__main__":
    main()
