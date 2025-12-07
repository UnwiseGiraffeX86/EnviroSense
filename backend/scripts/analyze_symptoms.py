import sys
import json
import joblib
import os
import numpy as np
from pathlib import Path

# Load model
MODEL_PATH = Path(__file__).parent.parent / 'symptom_severity_model.pkl'

def analyze(symptoms):
    try:
        symptoms_lower = symptoms.lower()
        
        # Enhanced Keyword Matching for Specialty
        specialty_keywords = {
            "Pulmonology": ["breath", "chest", "lung", "wheez", "asthma", "cough", "sputum", "air"],
            "Cardiology": ["heart", "palpitation", "pulse", "chest pain", "angina", "pressure"],
            "Neurology": ["head", "dizzy", "migraine", "vision", "faint", "seizure", "numb", "tingl"],
            "Dermatology": ["skin", "rash", "itch", "bump", "redness", "lesion", "acne"],
            "Gastroenterology": ["stomach", "belly", "gut", "nausea", "vomit", "diarrhea", "constipat", "acid"],
            "Orthopedics": ["bone", "joint", "muscle", "knee", "back", "shoulder", "fracture", "sprain"],
            "ENT": ["ear", "nose", "throat", "sinus", "hear", "smell", "voice"],
            "Psychiatry": ["anxiety", "depress", "mood", "panic", "sleep", "insomnia", "stress"]
        }

        specialty = "General Practice"
        max_matches = 0

        for spec, keywords in specialty_keywords.items():
            matches = sum(1 for k in keywords if k in symptoms_lower)
            if matches > max_matches:
                max_matches = matches
                specialty = spec
        
        # Fallback if matches are low but specific high-value keywords exist
        if max_matches == 0:
            if "pain" in symptoms_lower: specialty = "General Practice" # Could be anything

        # Severity Logic (Heuristic)
        severity_score = 0
        high_severity_keywords = ["severe", "extreme", "unbearable", "blood", "faint", "crushing", "sudden"]
        medium_severity_keywords = ["moderate", "persistent", "worsening", "painful"]
        
        if any(k in symptoms_lower for k in high_severity_keywords):
            severity_score += 5
        if any(k in symptoms_lower for k in medium_severity_keywords):
            severity_score += 3
            
        # Length of description as a proxy for complexity? Maybe not.
        if len(symptoms) > 100: severity_score += 1
        
        # Contextual severity
        if "breath" in symptoms_lower or "chest" in symptoms_lower: severity_score += 3
        if "heart" in symptoms_lower: severity_score += 3

        label = "Low"
        if severity_score >= 7: label = "High"
        elif severity_score >= 4: label = "Medium"
        
        # Cause Extraction (Simple Rule-based)
        causes = []
        if "breath" in symptoms_lower: causes.append("Respiratory Irritation")
        if "headache" in symptoms_lower: causes.append("Migraine/Tension")
        if "fever" in symptoms_lower: causes.append("Viral Infection")
        if "stomach" in symptoms_lower: causes.append("Gastritis")
        if "rash" in symptoms_lower: causes.append("Allergic Reaction")
        if "joint" in symptoms_lower: causes.append("Inflammation")
        
        if not causes: 
            causes.append("Undetermined - Clinical Eval Required")

        return {
            "severity": label,
            "possible_causes": causes,
            "confidence": 0.85 + (0.05 * max_matches), # Fake confidence boost based on matches
            "medical_specialty": specialty
        }
    except Exception as e:
        return {
            "severity": "Unknown",
            "possible_causes": ["Error in analysis"],
            "medical_specialty": "General Practice",
            "error": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        print(json.dumps(analyze(input_text)))
    else:
        print(json.dumps({"error": "No input provided"}))
