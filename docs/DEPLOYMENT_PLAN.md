# Deployment & Infrastructure Plan
## Deploying EcoResearch AI to Vercel and Render

---

## 1. Deployment Architecture Overview

EcoResearch AI uses a modern split-deployment strategy:

```
                  +-----------------------------------+
                  |        USER / BROWSER             |
                  +-----------------------------------+
                                    |
                    +---------------+---------------+
                    |                               |
                    v                               v
       +-------------------------+     +-------------------------+
       |   VERCEL (Frontend)     |     |   RENDER (Backend API)  |
       |   - Next.js 14 Web App  |     |   - FastAPI Server      |
       |   - UI Components       |     |   - LangGraph Engine    |
       |   - Static Assets       |     |   - PyPDF & Ingestion   |
       +-------------------------+     +-------------------------+
                                                    |
                                        +-----------+-----------+
                                        |                       |
                                        v                       v
                           +------------------------+ +-------------------+
                           | RENDER / NEON POSTGRES | | NVIDIA NIM API    |
                           | - pgvector Extension   | | - Llama 3.1 70B   |
                           | - LangGraph Checkpoints| | - Embeddings QA-4 |
                           | - SQL Tables           | +-------------------+
                           +------------------------+
```

---

## 2. Backend Deployment on Render

### Render Web Service Configuration (`render.yaml`)

- **Service Type**: Web Service (Python 3.11 Environment)
- **Name**: `ecoresearch-backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### PostgreSQL Database Service on Render
- **Database Name**: `ecoresearch_db`
- **Extensions Installed**: `CREATE EXTENSION IF NOT EXISTS vector;`
- **Connection String**: Provided via `DATABASE_URL` environment variable.

### Backend Environment Variables (`.env.production`)
```env
# NVIDIA NIM Model API Key
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Database Persistence
DATABASE_URL=postgresql+asyncpg://user:password@dpg-xxxxxx-a.render.com/ecoresearch_db

# CORS Configuration
ALLOWED_ORIGINS=https://ecoresearch-ai.vercel.app

# LangChain Tracing (Optional)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__xxxxxxxxxxxx
```

---

## 3. Frontend Deployment on Vercel

### Vercel Project Setup
- **Framework Preset**: Next.js
- **Root Directory**: `./` (or `frontend` if separated)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Frontend Environment Variables
```env
# URL pointing to deployed Render FastAPI backend
NEXT_PUBLIC_API_BASE_URL=https://ecoresearch-backend.onrender.com
```

---

## 4. Environment Variables Checklist & Secrets Management

| Variable Name | Component | Required For | Location |
|---------------|-----------|--------------|----------|
| `NVIDIA_API_KEY` | Backend | LLM & Embedding inference | Render Environment Secrets |
| `DATABASE_URL` | Backend | SQL persistent memory & vector storage | Render Environment Secrets |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend | API communication with backend | Vercel Environment Variables |

---

## 5. Verification & Continuous Integration Workflow

1. **Pre-Deploy Verification**: Run test suite (`pytest` backend & `npm test` frontend) to ensure RAG retrievers, NVIDIA endpoints, and database checkpointers pass.
2. **Database Migration**: Run Alembic migrations on startup script (`alembic upgrade head`).
3. **Health Check Endpoint**: `/health` endpoint on FastAPI verifying database connectivity and NVIDIA API key authorization before serving traffic.
4. **Smoke Test**: Ingest sample PDF file, verify vector generation, perform 1 Q&A iteration, and trigger 1 LangGraph report outline generation.
