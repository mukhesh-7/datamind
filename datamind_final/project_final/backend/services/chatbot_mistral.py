import os
import requests
from dotenv import load_dotenv
import re
import random
# Load environment variables from .env
load_dotenv()
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_MODEL = "open-mistral-7b"

if not MISTRAL_API_KEY:
    raise EnvironmentError("MISTRAL_API_KEY is not set in the environment variables.")

def is_greeting(text: str) -> bool:
    greetings = [
        r"^hi+\b", r"^hello\b", r"^hey\b", r"^hai+\b", r"^good (morning|afternoon|evening|day)\b", r"^greetings\b", r"^sup\b", r"^yo\b", r"^hola\b", r"^howdy\b"
    ]
    text = text.strip().lower()
    return any(re.match(pattern, text) for pattern in greetings)

GREETING_RESPONSES = [
    "Hello! How can I help you today?",
    "Hi there! What can I do for you?",
    "Hey! How can I assist you?",
    "Greetings! Need any help?",
    "Hi! Feel free to ask me anything.",
    "Hello! I'm here if you need anything.",
    "Hey there! How can I be of service?",
    "Hi! What would you like to talk about?",
]

def chat_with_mistral(query: str, context: str = "") -> str:
    if is_greeting(query):
        return random.choice(GREETING_RESPONSES)
    """
    Interact with Mistral AI using the open-mistral-7b model.
    :param query: User's input or question.
    :param context: (Optional) System prompt or behavior guideline.
    :return: AI-generated response as a string.
    """
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }

    # If the user message is a greeting, do NOT send the document context
    if is_greeting(query):
        messages = [
            {"role": "user", "content": query}
        ]
    elif context.strip():
        messages = [
            {"role": "system", "content": context.strip()},
            {"role": "user", "content": query}
        ]
    else:
        messages = [
            {"role": "user", "content": query}
        ]

    payload = {
        "model": MISTRAL_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 512,
        "top_p": 1
    }

    try:
        response = requests.post(MISTRAL_ENDPOINT, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()

        if "choices" in data and len(data["choices"]) > 0:
            return data["choices"][0]["message"]["content"].strip()
        else:
            return "Error: No response content returned from Mistral."

    except requests.exceptions.HTTPError as e:
        return f"HTTP Error: {e.response.status_code} - {e.response.text}"
    except requests.exceptions.RequestException as e:
        return f"Request Error: Unable to reach Mistral API. ({str(e)})"
    except Exception as e:
        return f"Unexpected Error: {str(e)}"
