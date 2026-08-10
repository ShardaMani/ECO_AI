import os
import logging
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Explicitly load .env and .env.local from backend/ and root directories
load_dotenv(".env")
load_dotenv(".env.local")
load_dotenv("../.env")
load_dotenv("../.env.local")

class Settings(BaseSettings):
    PROJECT_NAME: str = "EcoResearch AI"
    VERSION: str = "1.0.0"
    
    # NVIDIA API Key for models (MUST start with 'nvapi-')
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")
    
    # NVIDIA Model Choices
    NVIDIA_LLM_MODEL: str = "meta/llama-3.1-70b-instruct"
    
    # NVIDIA NIM Embedding Model (512 token limit)
    NVIDIA_EMBED_MODEL: str = os.getenv("NVIDIA_EMBED_MODEL", "nvidia/nv-embedqa-e5-v5")
    
    # Database URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./ecoresearch.db")
    
    # CORS string
    ALLOWED_ORIGINS_RAW: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    
    # Vector Chunking Configuration (Safely set to 400 to respect 512 token ceiling)
    CHUNK_SIZE: int = 400
    CHUNK_OVERLAP: int = 80

    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        if not self.ALLOWED_ORIGINS_RAW:
            return ["http://localhost:3000", "http://127.0.0.1:3000"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS_RAW.split(",") if origin.strip()]

settings = Settings()

# Ensure os.environ["NVIDIA_API_KEY"] is set globally for LangChain NVIDIA endpoints
if settings.NVIDIA_API_KEY:
    os.environ["NVIDIA_API_KEY"] = settings.NVIDIA_API_KEY
    logger.info("NVIDIA API Key loaded successfully.")
else:
    logger.warning("NVIDIA_API_KEY is missing! Please place NVIDIA_API_KEY=nvapi-... in backend/.env")
