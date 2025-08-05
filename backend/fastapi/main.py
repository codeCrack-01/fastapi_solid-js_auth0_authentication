from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import verify_jwt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app with metadata
app = FastAPI(
    title="OrderOne API",
    description="Authentication protected API with Auth0",
    version="1.0.0"
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to OrderOne API. Use /api/protected for authenticated routes."}

@app.get("/api/protected")
async def protected_route(user=Depends(verify_jwt)):
    return {"message": "You are authenticated!", "user": user}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
