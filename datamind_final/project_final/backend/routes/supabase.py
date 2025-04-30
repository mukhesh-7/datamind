from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from supabase_client import supabase

router = APIRouter()

@router.get("/documents")
async def get_documents(user_id: str = Query(...)):
    """Fetch all documents for a specific user."""
    response = supabase.table("Documents").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    # Ensure created_at is always present
    documents = response.data or []
    for doc in documents:
        if not doc.get("created_at"):
            doc["created_at"] = ""
    return {"documents": documents}

@router.get("/chatHistory")
async def get_chat_history(document_id: str = Query(...)):
    """Fetch chat history for a specific document."""
    response = supabase.table("Chats").select("*").eq("document_id", document_id).execute()
    return {"chat_history": response.data}

@router.post("/preferences")
async def set_preferences(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    summarizer_model = data.get("summarizer_model")
    chatbot_model = data.get("chatbot_model")
    if not user_id or not summarizer_model or not chatbot_model:
        return JSONResponse(status_code=400, content={"message": "Missing required fields"})
    # Upsert user preferences in Supabase
    response = supabase.table("UserPreferences").upsert({
        "user_id": user_id,
        "summarizer_model": summarizer_model,
        "chatbot_model": chatbot_model
    }).execute()
    if hasattr(response, 'error') and response.error:
        return JSONResponse(status_code=500, content={"message": str(response.error)})
    return {"message": "Preferences updated successfully"}

@router.post("/subscriptions")
async def create_subscription(user_id: str, plan: str):
    """Create a subscription for a user."""
    subscription = {
        "user_id": user_id,
        "plan": plan,
        "start_date": "now()",
        "status": "active"
    }
    supabase.table("Subscription").insert(subscription).execute()
    return {"message": "Subscription created successfully"}

@router.post("/analytics")
async def log_analytics(user_id: str, analysis_type: str, details: str, document_id: str = None):
    """Log user actions for analytics purposes."""
    analytics_entry = {
        "user_id": user_id,
        "document_id": document_id,
        "analysis_type": analysis_type,
        "result": details,
        "created_at": "now()"
    }
    supabase.table("Analytics").insert(analytics_entry).execute()
    return {"message": "Analytics logged successfully"}

@router.post("/password-reset")
async def request_password_reset(user_id: str, reset_token: str):
    """Log a password reset request."""
    reset_entry = {
        "user_id": user_id,
        "token": reset_token,
        "created_at": "now()"
    }
    supabase.table("Password_Resets").insert(reset_entry).execute()
    return {"message": "Password reset request logged successfully"}

@router.post("/register")
async def register_user(email: str, password: str, name: str):
    user = {
        "email": email,
        "password": password,
        "name": name,
        "created_at": "now()"
    }
    response = supabase.table("User").upsert(user).execute()
    return {"message": "User registered", "user": response.data}

@router.post("/login")
async def login_user(email: str, password: str):
    response = supabase.table("User").select("*").eq("email", email).eq("password", password).execute()
    if response.data:
        return {"message": "Login successful", "user": response.data[0]}
    else:
        return {"message": "Invalid credentials", "user": None}
