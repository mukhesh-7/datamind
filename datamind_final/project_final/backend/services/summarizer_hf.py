import requests
import os
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
if not HF_API_KEY:
    raise EnvironmentError("HF_API_KEY not set in environment variables.")

def summarize_with_hf(content: str) -> str:
    response = requests.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        headers={"Authorization": f"Bearer {HF_API_KEY}"},
        json={"inputs": content}
    )
    return response.json()[0].get("summary_text", "Failed to summarize")
