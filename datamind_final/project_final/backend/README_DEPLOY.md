# Backend Deployment Instructions

## 1. Prerequisites
- Python 3.8+
- [GitHub account](https://github.com/)
- [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com) account

## 2. Prepare the Code
- Ensure all dependencies are listed in `requirements.txt`.
- Sensitive keys should be set as environment variables (see `.env.example`).

## 3. Deploy to Render (Recommended)
1. Push this backend folder to a public GitHub repository.
2. Go to [Render](https://render.com) > New Web Service.
3. Connect your GitHub repo and select this backend folder.
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn app:app --host 0.0.0.0 --port 10000`
6. Set environment variables in the Render dashboard.
7. Deploy!

## 4. CORS
- The backend is configured to allow all origins. For production, set your frontend URL in `allow_origins` in `app.py`.

## 5. Update Frontend
- In your frontend code, update API URLs to point to the deployed backend URL.

## 6. Example `.env.example`
```
# Example environment variables
OPENAI_API_KEY=your-key-here
SUPABASE_URL=your-url-here
SUPABASE_KEY=your-key-here
```
