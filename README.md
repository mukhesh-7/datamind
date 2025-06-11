# DataMind

DataMind is a platform that uses AI to improve learning by providing accurate and personalized study materials. This project is aimed at creating a smart web application that can effectively extract text from both structured and unstructured PDF files with the use of Optical Character Recognition (OCR), Natural Language Processing (NLP), and Machine Learning techniques. In addition to extracting content, the system automatically corrects grammar to ensure the output is clean, readable, and ready for use in an academic or professional context. DataMind provides an intelligent and scalable solution for document processing, which is best suited for students, teachers, and researchers who handle large amounts of learning material.

## Key Features

*   **AI-Powered Learning:** Leverages AI to provide accurate and personalized study materials.
*   **Advanced Text Extraction:** Extracts text from structured and unstructured PDF files.
*   **OCR Technology:** Employs Optical Character Recognition for accurate text capture from images/PDFs.
*   **NLP Capabilities:** Utilizes Natural Language Processing for understanding and processing extracted text.
*   **Machine Learning Integration:** Implements ML techniques for enhanced document processing and personalization.
*   **Automatic Grammar Correction:** Ensures extracted content is grammatically correct, clean, and readable.
*   **Scalable Document Processing:** Designed to handle large volumes of learning materials efficiently.
*   **User-Friendly Interface:** Provides an intuitive platform for students, teachers, and researchers.
*   **Secure User Authentication:** Ensures user data and processed materials are protected.

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite
    *   Tailwind CSS
    *   TypeScript
*   **Backend:**
    *   Python
    *   FastAPI
    *   Uvicorn (for serving)
*   **Database/Backend Services:**
    *   Supabase
*   **Deployment Platforms (examples for backend):**
    *   Render
    *   Railway
    *   Heroku

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js and npm (or yarn):** For managing frontend packages and running scripts. (Download from [https://nodejs.org/](https://nodejs.org/))
*   **Python (3.8+ recommended) and pip:** For backend development. (Download from [https://www.python.org/](https://www.python.org/))
*   **Git:** For cloning the repository. (Download from [https://git-scm.com/](https://git-scm.com/))
*   **Supabase Account:** You will need a Supabase project for database and backend services. (Create one at [https://supabase.com/](https://supabase.com/))

## Configuration

Proper configuration is crucial for running DataMind, especially regarding API keys and service URLs.

*   **Backend Configuration (`project_final/backend/.env`):**
    *   As mentioned in the setup, a `.env` file in the backend directory is used to store sensitive information.
    *   **`SUPABASE_URL`**: Your Supabase project URL.
    *   **`SUPABASE_KEY`**: Your Supabase project public API key (or service key if appropriate for backend operations).
    *   **`OPENAI_API_KEY`**: If using OpenAI for NLP/ML features, your API key is required here. Similar keys for other AI/ML services should also be stored here.
    *   Other environment-specific variables can be added as needed.

*   **Frontend Configuration (`project_final/frontend/.env` or similar):**
    *   The frontend needs to know the address of the backend API. This is typically set via an environment variable like `VITE_API_BASE_URL`.
        ```
        VITE_API_BASE_URL=http://localhost:9000 
        ```
        For production, this should be the URL of your deployed backend.
    *   If the frontend directly interacts with services like Supabase for certain features (e.g., authentication UI), it might also require Supabase URL and anon key, typically prefixed with `VITE_` for Vite projects (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

**Security Note:** Never commit `.env` files directly to your Git repository. Always include `.env` in your `.gitignore` file to prevent accidental exposure of sensitive credentials. Provide a `.env.example` file if necessary to show what variables are needed.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url> # Replace <repository_url> with the actual URL
    cd datamind_final
    ```

2.  **Backend Setup (`project_final/backend`):**
    *   Navigate to the backend directory:
        ```bash
        cd project_final/backend
        ```
    *   Create a Python virtual environment (recommended):
        ```bash
        python -m venv venv
        ```
    *   Activate the virtual environment:
        *   On Windows:
            ```bash
            .\venv\Scripts\activate
            ```
        *   On macOS/Linux:
            ```bash
            source venv/bin/activate
            ```
        ```
    *   Set up environment variables:
        *   Create a `.env` file in the `project_final/backend` directory.
        *   Refer to the `README_DEPLOY.md` (specifically the `.env.example` section) for required variables like `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY`. Add these to your `.env` file with your actual credentials.
        *   Example `.env` content:
            ```
            OPENAI_API_KEY=your_openai_api_key
            SUPABASE_URL=your_supabase_url
            SUPABASE_KEY=your_supabase_key
            ```

3.  **Frontend Setup (`project_final/frontend`):**
    *   Navigate to the frontend directory (from the `datamind_final` root):
        ```bash
        cd project_final/frontend 
        ```
        (If you are already in `project_final/backend`, you'd do `cd ../frontend`)
    *   Install dependencies:
        ```bash
        npm install 
        ```
        or if you prefer yarn:
        ```bash
        yarn install
        ```
    *   Set up environment variables:
        *   The frontend will need to know the URL of your running backend API. This is typically configured in the frontend code where API calls are made (e.g., in a config file or directly in service modules).
        *   You might need to create a `.env` file in `project_final/frontend` similar to how it's done for the backend, depending on how the frontend is configured to consume environment variables (e.g., using `VITE_API_BASE_URL`). For example:
            ```
            VITE_API_BASE_URL=http://localhost:9000 
            ```
            (Adjust the port if your backend runs on a different one).

## Running the Application (Development)

Ensure you have completed the setup steps for both backend and frontend, including installing dependencies and setting up environment variables.

1.  **Run the Backend Server:**
    *   Navigate to the `project_final/backend` directory.
    *   Activate your Python virtual environment if you haven't already:
        *   Windows: `.\venv\Scripts\activate`
        *   macOS/Linux: `source venv/bin/activate`
    *   Start the FastAPI application using Uvicorn:
        ```bash
        uvicorn app:app --host 0.0.0.0 --port 9000 --reload
        ```
        The `--reload` flag enables auto-reloading when code changes are detected. The backend will typically be available at `http://localhost:9000`.

2.  **Run the Frontend Development Server:**
    *   Navigate to the `project_final/frontend` directory.
    *   Start the Vite development server:
        ```bash
        npm run dev
        ```
        or if you use yarn:
        ```bash
        yarn dev
        ```
    *   The frontend application will typically be available at `http://localhost:8000` (Vite's default) or another port if specified in your Vite configuration. Check the terminal output when you run the command.
    *   Ensure your frontend's API calls are configured to point to the backend URL (e.g., `http://localhost:9000`).

## Building for Production

1.  **Build the Frontend:**
    *   Navigate to the `project_final/frontend` directory.
    *   Run the build script:
        ```bash
        npm run build
        ```
        or if you use yarn:
        ```bash
        yarn build
        ```
    *   This command will generate a `dist` folder (or similar, as configured in `vite.config.ts`) in the `project_final/frontend` directory. This folder contains the static assets (HTML, CSS, JavaScript) for your frontend, which can then be deployed to any static site hosting service.

2.  **Backend:**
    *   The Python backend (FastAPI) doesn't have a separate "build" step in the same way a compiled language or a frontend framework does.
    *   For production, you'll deploy the Python code directly. Ensure all dependencies are listed in `requirements.txt`.
    *   The application will be run using a production-grade ASGI server like Uvicorn (often with Gunicorn as a process manager in production environments, though `README_DEPLOY.md` uses Uvicorn directly).
    *   Refer to the deployment instructions for setting up the backend in a production environment.

## Deployment

*   **Frontend:**
    *   The production build of the frontend (typically in the `project_final/frontend/dist` folder) consists of static files.
    *   Deploy this `dist` folder to any static site hosting platform such as:
        *   Vercel
        *   Netlify
        *   AWS S3 & CloudFront
        *   GitHub Pages (if applicable)
        *   Render (for static sites)
    *   Ensure your frontend is configured to point to the deployed backend API URL.

*   **Backend:**
    *   The backend is a FastAPI application.
    *   Detailed instructions for deploying the backend can be found in `project_final/backend/README_DEPLOY.md`. This guide covers deployment to services like Render.
    *   Key aspects include managing environment variables for sensitive data (API keys, database URLs) directly on the hosting platform.

## Code Citations

This project aims to adhere to proper citation practices for any external code snippets or libraries that have specific attribution requirements beyond their standard licenses.
Please refer to the `project_final/# Code Citations.md` file for a list of any such citations.
