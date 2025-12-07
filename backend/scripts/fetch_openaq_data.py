import requests
import json
import os
import sys

def fetch_openaq_data():
    api_key = os.environ.get("OPENAQ_API_KEY")
    
    if not api_key:
        # Check command line args
        if len(sys.argv) > 1:
            api_key = sys.argv[1]
    
    if not api_key:
        print("Error: OpenAQ API v3 requires an API Key.")
        print("Please set the OPENAQ_API_KEY environment variable or pass it as an argument.")
        print("Example: python3 fetch_openaq_data.py YOUR_API_KEY")
        print("You can get a key at https://openaq.org/")
        return

    url = "https://api.openaq.org/v3/locations"
    
    # Bucharest coordinates
    lat = 44.4268
    lon = 26.1025
    radius = 25000 # 25km
    
    params = {
        "coordinates": f"{lat},{lon}",
        "radius": radius,
        "limit": 100,
    }
    
    headers = {
        "X-API-Key": api_key,
        "User-Agent": "BESTEM-App/1.0",
        "Accept": "application/json"
    }
    
    print(f"Fetching data from {url}...")
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        results = data.get("results", [])
        count = len(results)
        
        print(f"\nFound {count} stations within {radius}m of Bucharest.")
        
        if count > 0:
            print("\n--- Sample Data ---")
            for i, station in enumerate(results[:5]):
                print(f"\nStation {i+1}:")
                print(f"  Name: {station.get('name')}")
                print(f"  ID: {station.get('id')}")
                
                coords = station.get('coordinates', {})
                if coords:
                     print(f"  Coordinates: Lat {coords.get('latitude')}, Lon {coords.get('longitude')}")
                
                print("  Sensors:")
                sensors = station.get('sensors', [])
                for sensor in sensors:
                    param = sensor.get('parameter', {})
                    name = param.get('name') if isinstance(param, dict) else param
                    print(f"    - {name}")
                    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response content: {e.response.text[:500]}")

if __name__ == "__main__":
    fetch_openaq_data()
