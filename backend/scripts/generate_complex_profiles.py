import os
import json
import random
import binascii
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client
from faker import Faker
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

# Load env
from pathlib import Path
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
ENCRYPTION_KEY_HEX = os.getenv("DATA_ENCRYPTION_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, ENCRYPTION_KEY_HEX]):
    print("Error: Missing API keys or Encryption Key.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
fake = Faker()

def encrypt_text(text):
    if not text:
        return None
    # Ensure text is string
    if not isinstance(text, str):
        text = str(text)
        
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

def generate_medical_profiles():
    print("Fetching existing profiles...")
    try:
        profiles_res = supabase.table("profiles").select("id").execute()
        profiles = [p['id'] for p in profiles_res.data]
    except Exception as e:
        print(f"Error fetching profiles: {e}")
        return

    if not profiles:
        print("No profiles found.")
        return

    print(f"Generating medical data for {len(profiles)} profiles...")
    
    # Medical Data Pools
    conditions_pool = [
        "Asthma", "Hypertension", "Type 2 Diabetes", "Chronic Bronchitis", 
        "Allergic Rhinitis", "Migraine", "Eczema", "Anxiety Disorder",
        "Gastroesophageal Reflux Disease (GERD)", "Insomnia"
    ]
    
    family_history_pool = [
        "Father: Hypertension", "Mother: Asthma", "Grandfather: Lung Cancer",
        "Mother: Type 2 Diabetes", "Father: Myocardial Infarction",
        "Sibling: Celiac Disease", "Grandmother: Stroke"
    ]
    
    medications_pool = [
        "Albuterol Inhaler", "Lisinopril", "Metformin", "Cetirizine",
        "Ibuprofen", "Omeprazole", "Sertraline", "Melatonin"
    ]

    blood_types = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

    new_records = []
    
    for user_id in profiles:
        # Generate Personal Info
        gender = random.choice(["Male", "Female"])
        full_name = fake.name_male() if gender == "Male" else fake.name_female()
        
        # DOB (Age 18-80)
        age = random.randint(18, 80)
        dob = fake.date_of_birth(minimum_age=18, maximum_age=80).isoformat()
        
        # Biometrics
        height = random.randint(150, 200) if gender == "Male" else random.randint(140, 180)
        weight = random.randint(50, 120)
        blood_type = random.choice(blood_types)
        
        # Medical History (Random subset)
        has_condition = random.random() < 0.4 # 40% chance
        conditions = random.sample(conditions_pool, k=random.randint(1, 3)) if has_condition else []
        
        has_history = random.random() < 0.3
        history = random.sample(family_history_pool, k=random.randint(1, 2)) if has_history else []
        
        has_meds = has_condition and random.random() < 0.8
        meds = random.sample(medications_pool, k=random.randint(1, 2)) if has_meds else []
        
        # Encrypt Everything
        record = {
            "user_id": user_id,
            "encrypted_full_name": encrypt_text(full_name),
            "encrypted_dob": encrypt_text(dob),
            "encrypted_gender": encrypt_text(gender),
            "encrypted_height_cm": encrypt_text(str(height)),
            "encrypted_weight_kg": encrypt_text(str(weight)),
            "encrypted_blood_type": encrypt_text(blood_type),
            "encrypted_existing_conditions": encrypt_text(json.dumps(conditions)),
            "encrypted_family_history": encrypt_text(json.dumps(history)),
            "encrypted_medications": encrypt_text(json.dumps(meds))
        }
        
        new_records.append(record)
        
    print(f"Upserting {len(new_records)} medical profiles...")
    
    # Batch insert/upsert
    batch_size = 50
    for i in range(0, len(new_records), batch_size):
        batch = new_records[i:i+batch_size]
        try:
            # Using upsert to update if exists
            supabase.table("medical_profiles").upsert(batch, on_conflict="user_id").execute()
            print(f"Processed batch {i//batch_size + 1}")
        except Exception as e:
            print(f"Error inserting batch: {e}")
            if "relation \"medical_profiles\" does not exist" in str(e):
                print("\nCRITICAL: The table 'medical_profiles' does not exist.")
                print("Please run the SQL script located at 'database/medical_profiles.sql' in your Supabase SQL Editor.")
                return

if __name__ == "__main__":
    generate_medical_profiles()
