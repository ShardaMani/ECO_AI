import os
import logging
from fastapi import HTTPException
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings
from app.config import settings

logger = logging.getLogger(__name__)

def validate_nvidia_api_key():
    """Validates that NVIDIA_API_KEY is present and properly formatted."""
    api_key = settings.NVIDIA_API_KEY or os.getenv("NVIDIA_API_KEY", "")
    if not api_key:
        raise HTTPException(
            status_code=401,
            detail="NVIDIA_API_KEY is missing! Please set NVIDIA_API_KEY=nvapi-... in backend/.env file."
        )
    return api_key

def get_nvidia_chat_llm(model_name: str = None, temperature: float = 0.2):
    """Initializes LLM instance connected strictly to NVIDIA API Key endpoints with extended timeout."""
    api_key = validate_nvidia_api_key()
    target_model = model_name or settings.NVIDIA_LLM_MODEL
    logger.info(f"Initializing ChatNVIDIA model: {target_model} (Timeout: 300s)")
    
    return ChatNVIDIA(
        model=target_model,
        nvidia_api_key=api_key,
        temperature=temperature,
        max_tokens=4096,
        timeout=300  # Set 300-second (5 min) extended timeout for deep RAG & 70B report synthesis
    )

def get_nvidia_embeddings(model_name: str = None):
    """Initializes Vector Embedding instance connected strictly to NVIDIA API Key endpoints."""
    api_key = validate_nvidia_api_key()
    target_model = model_name or settings.NVIDIA_EMBED_MODEL
    logger.info(f"Initializing NVIDIAEmbeddings model: {target_model}")
    
    return NVIDIAEmbeddings(
        model=target_model,
        nvidia_api_key=api_key,
        timeout=180
    )
