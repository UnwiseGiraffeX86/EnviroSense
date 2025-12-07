import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY")

def debug_openaq_structure():
    url = "https://api.openaq.org/v3/locations"
    lat = 44.4268
    lon = 26.1025
    radius = 25000
    
    headers = {"X-API-Key": OPENAQ_API_KEY}
    params = {"coordinates": f"{lat},{lon}", "radius": radius, "limit": 1}
    
    res = requests.get(url, headers=headers, params=params)
    print(json.dumps(res.json(), indent=2))

if __name__ == "__main__":
    debug_openaq_structure()
