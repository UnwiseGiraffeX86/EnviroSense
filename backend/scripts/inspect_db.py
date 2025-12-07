import os
from dotenv import load_dotenv
from supabase import create_client
from pathlib import Path

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

def check_counts():
    print("--- Checking Potential Tables ---")
    tables_to_check = [
        "profiles", "patient_logs", "air_quality", "weather_history", "medical_profiles",
        "appointments", "lab_results", "doctors", "documents"
    ]
    
    for t in tables_to_check:
        try:
            res = supabase.table(t).select("*", count="exact").limit(1).execute()
            print(f"{t}: {res.count} rows")
        except Exception as e:
            if "404" in str(e) or "PGRST205" in str(e):
                print(f"{t}: Does not exist")
            else:
                print(f"{t}: Error ({e})")

def check_air_quality():
    print("\n--- Air Quality Sample ---")
    try:
        # Check for old synthetic sectors
        res = supabase.table("air_quality").select("sector_name").not_.ilike("sector_name", "%(Station)%").execute()
        print(f"Non-station sectors found: {len(res.data)}")
        for r in res.data:
            print(r)
            
        res = supabase.table("air_quality").select("sector_name, pm25").limit(10).execute()
        # for r in res.data:
        #     print(r)
    except:
        pass

if __name__ == "__main__":
    check_counts()
    check_air_quality()
