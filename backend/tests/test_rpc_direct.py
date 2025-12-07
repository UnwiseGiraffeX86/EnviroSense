import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(url, key)

# Test Coordinates (Sector 1)
lat = 44.42
long = 26.05

print(f"Testing RPC 'get_air_quality_for_point' with Lat: {lat}, Long: {long}")

try:
    response = supabase.rpc("get_air_quality_for_point", {"lat": lat, "long": long}).execute()
    print("Response:", response.data)
except Exception as e:
    print("Error:", e)
