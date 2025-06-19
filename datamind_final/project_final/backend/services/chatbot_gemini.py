import os
from dotenv import load_dotenv
import requests

# Always load the .env from the backend root
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not set in environment variables.")

def chat_with_gemini(query: str, context: str) -> str:
    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key={GEMINI_API_KEY}",
            json={
                "contents": [
                    {"parts": [
                        {"text": f"Context: {context}\n\nUser: {query}\n\nAssistant:"}
                    ]}
                ]
            },
        )
        response.raise_for_status()
        data = response.json()
        # Extract the response from Gemini (adjust as per actual API response)
        return data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No response from Gemini.")
    except requests.exceptions.RequestException as e:
        print(f"Error communicating with Gemini API: {e}")
        return f"Error: Unable to process the query at this time. ({e})"
