import os
import requests
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client
import time

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

def fetch_weather_data():
    print("Fetching historical weather data from Open-Meteo...")
    
    # Bucharest coordinates
    lat = 44.4268
    lon = 26.1025
    
    # Date range: Last 2 years
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=730)).strftime("%Y-%m-%d")
    
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation",
        "timezone": "GMT"
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        hourly = data['hourly']
        timestamps = hourly['time']
        temps = hourly['temperature_2m']
        humidities = hourly['relative_humidity_2m']
        pressures = hourly['surface_pressure']
        wind_speeds = hourly['wind_speed_10m']
        wind_dirs = hourly['wind_direction_10m']
        precips = hourly['precipitation']
        
        records = []
        print(f"Processing {len(timestamps)} records...")
        
        for i in range(len(timestamps)):
            # Open-Meteo returns ISO8601
            ts = timestamps[i]
            # Ensure it's compatible with timestamptz
            if len(ts) == 16: # YYYY-MM-DDTHH:MM
                ts += ":00+00:00" # GMT
            
            records.append({
                "timestamp": ts,
                "lat": lat,
                "lon": lon,
                "temperature_2m": temps[i],
                "relative_humidity_2m": humidities[i],
                "surface_pressure": pressures[i],
                "wind_speed_10m": wind_speeds[i],
                "wind_direction_10m": wind_dirs[i],
                "precipitation": precips[i]
            })
            
        return records
        
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return []

def insert_data(records):
    if not records:
        return

    print(f"Inserting {len(records)} records into Supabase...")
    
    batch_size = 1000
    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        try:
            supabase.table("weather_history").insert(batch).execute()
            print(f"Inserted batch {i//batch_size + 1}")
        except Exception as e:
            print(f"Error inserting batch: {e}")
            if "relation \"weather_history\" does not exist" in str(e):
                print("\nCRITICAL: The table 'weather_history' does not exist.")
                print("Please run the SQL script located at 'database/weather_history.sql' in your Supabase SQL Editor.")
                return
            # Continue trying other batches? No, probably schema issue.
            return

if __name__ == "__main__":
    # Use GMT to avoid timezone confusion
    # Re-defining fetch to use GMT
    
    records = fetch_weather_data()
    insert_data(records)
