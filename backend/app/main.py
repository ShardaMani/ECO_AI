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

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend service for EcoResearch AI - Sustainability Policy Analysis Workspace"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(reports.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "message": "EcoResearch AI Backend is running."
    }

@app.get("/health")
async def health_check():
    has_nvidia_key = bool(settings.NVIDIA_API_KEY and settings.NVIDIA_API_KEY.startswith("nvapi-"))
    return {
        "status": "healthy",
        "nvidia_api_key_configured": has_nvidia_key,
        "llm_model": settings.NVIDIA_LLM_MODEL,
        "embed_model": settings.NVIDIA_EMBED_MODEL
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
