import json
import urllib.request

API_KEY = "AIzaSyBQheHz9DVvIt-0C6nq34G9GZt0oycCiMY"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key={API_KEY}"

data = {
    "contents": [{"role": "user", "parts": [{"text": "Hello"}]}]
}

req = urllib.request.Request(URL, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(json.dumps(result, indent=2))
except Exception as e:
    print(e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
