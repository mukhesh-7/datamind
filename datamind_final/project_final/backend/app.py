from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, summarize, supabase, upload

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["datamindv1.netlify.app"],  # Update with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(chat.router, prefix="/chat")
app.include_router(summarize.router, prefix="/summarize")
app.include_router(supabase.router, prefix="/supabase")
app.include_router(upload.router, prefix="/upload")

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 9000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
