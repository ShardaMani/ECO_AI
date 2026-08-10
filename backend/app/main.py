import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import documents, chat, reports

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for EcoResearch AI - Powered by LangChain, LangGraph & NVIDIA NIM API"
)

# Universal CORS Middleware Configuration (Allows Vercel, Render, and Local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(reports.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "nvidia_api_key_configured": bool(settings.NVIDIA_API_KEY),
        "llm_model": settings.NVIDIA_LLM_MODEL,
        "embed_model": settings.NVIDIA_EMBED_MODEL
    }
