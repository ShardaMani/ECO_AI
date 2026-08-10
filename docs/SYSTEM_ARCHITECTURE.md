# Technical System Architecture Specification
## EcoResearch AI: LangGraph, LangChain, SQL & NVIDIA Engine Architecture

---

## 1. System Overview & Technology Stack

The architecture of EcoResearch AI is designed as a decoupled, asynchronous, agentic RAG and report synthesis system featuring **Universal Strict Citation Enforcement**.

```
+-----------------------------------------------------------------------+
|                           FRONTEND LAYER                              |
|   Next.js 14+ (React, Tailwind CSS v4 / Vanilla Tokens, Lucide, SSE)   |
|   Hosted on Vercel | Dimension Dusk-Lit UI Theme                      |
|   Features Interactive Citation Cards & Snippet Popover Viewer       |
+-----------------------------------------------------------------------+
                                   |
                         REST / SSE API (HTTP/2)
                                   v
+-----------------------------------------------------------------------+
|                            BACKEND LAYER                              |
|   Python 3.11+ FastAPI Server                                         |
|   LangChain v0.3+ | LangGraph v0.2+ State Graph Workflow              |
|   Dedicated Citation Verifier & Citation Post-Processing Engine       |
|   Hosted on Render Service                                            |
+-----------------------------------------------------------------------+
         |                         |                         |
         v                         v                         v
+------------------+     +-------------------+     +--------------------+
|  NVIDIA NIM API  |     |  SQL DATABASE     |     |   VECTOR DATABASE  |
|  LLM & Embeddings|     |  PostgreSQL /     |     |   pgvector /       |
|  Llama 3.1 70B   |     |  LangGraph Saver  |     |   Chroma DB        |
+------------------+     +-------------------+     +--------------------+
```

### Core Technologies
1. **Frontend**: Next.js 14+ (App Router), TypeScript, Vanilla CSS / Tailwind v4 using **Dimension Design Tokens**, Lucide Icons, EventSource (SSE for real-time streaming).
2. **Backend API**: Python 3.11, FastAPI, Uvicorn, Pydantic v2.
3. **Agent Orchestration**: **LangGraph** (StateGraph with state persistence and human-in-the-loop checkpointing), **LangChain v0.3**.
4. **LLM & Embeddings Provider**: **NVIDIA API Key** (`langchain-nvidia-ai-endpoints`), utilizing `meta/llama-3.1-70b-instruct` / `mistralai/mixtral-8x22b-instruct` for reasoning & generation, and `nvidia/embed-qa-4` for vector embeddings.
5. **Database & Memory Persistence**: PostgreSQL with `pgvector` extension (or SQLite for local dev), utilizing LangGraph `PostgresSaver` / `SqliteSaver` for persistent state checkpointing across sessions.

---

## 2. Ingestion & Fine-Grained Citation Indexing Pipeline

### Document Processing Workflow
For processing 20 to 50+ dense PDFs per project session with page & paragraph precision:

```
[ PDF / DOCX Upload ] 
        |
        v
[ PyPDF / Unstructured Reader ] -> Extract Text & Page/Paragraph Structure
        |
        v
[ Citation-Aware Text Splitter ] 
  - Chunk Size: 1000 tokens, Overlap: 200 tokens
  - Injects Metadata: { chunk_id, doc_id, file_name, page_number, paragraph_number, section_title }
        |
        v
[ NVIDIA Embedding API (`nvidia/embed-qa-4`) ]
        |
        v
[ PGVector / Vector Database Storage ]
```

---

## 3. LangGraph Report Generation State Graph with Citation Audit

The core intelligence of EcoResearch AI lies in a multi-agent **LangGraph StateGraph** designed specifically for long-form report drafting with mandatory source verifications:

```
                       [ Start Report Workflow ]
                                   |
                                   v
                       +-----------------------+
                       |  1. Outline Planner   | <--- Generates initial outline
                       +-----------------------+      mapped to document sources
                                   |
                                   v
                        [ Human Approval Step ] (User edits outline if needed)
                                   |
                                   v
                       +-----------------------+
                       | 2. Section Dispatcher | <--- Splits outline into parallel
                       +-----------------------+      section tasks
                                   |
        +--------------------------+--------------------------+
        |                                                     |
        v                                                     v
+-----------------------+                             +-----------------------+
| 3a. Section Research  |                             | 3b. Section Research  |
|     (Sub-agent A)     |                             |     (Sub-agent B)     |
+-----------------------+                             +-----------------------+
        |                                                     |
        +--------------------------+--------------------------+
                                   |
                                   v
                       +-----------------------+
                       | 4. Citation Verifier  | <--- MANDATORY AUDIT NODE:
                       +-----------------------+      Verifies 100% of sentences
                                   |                  and attaches [Doc X, p. Y]
                                   v
                       +-----------------------+
                       | 5. Report Synthesizer | <--- Compiles executive summary,
                       +-----------------------+      table of contents, markdown
                                   |                  and Bibliography / Citations
                                   v
                         [ Final Report Saved ]
```

### Universal Citation Schema & LangGraph State

```python
from typing import List, Dict, Any, TypedDict
from pydantic import BaseModel, Field

class CitationMetadata(BaseModel):
    citation_id: str
    doc_id: str
    file_name: str
    page_number: int
    paragraph_number: int
    section_title: str
    verbatim_snippet: str
    relevance_score: float

class ReportState(TypedDict):
    session_id: str
    user_query: str
    selected_doc_ids: List[str]
    outline: List[Dict[str, str]]
    section_drafts: Dict[str, str]
    verified_citations: List[CitationMetadata] # List of all verified citations
    final_report_md: str
    current_step: str
    is_completed: bool
```

---

## 4. Citation Verification Engine Details

The `CitationVerifier` node operates as follows for **every sentence** outputted by the LLM:

1. **Sentence Segmentation**: The raw output string is broken into individual declarative claims/sentences.
2. **Chunk Match Verification**: For each claim, the verifier queries vector embeddings to find the exact chunk (`relevance_score > 0.75`) from which the claim was derived.
3. **Citation Tag Injection**: If matched, an inline citation tag `[Doc: {file_name}, p. {page_number}]` is inserted immediately after the sentence.
4. **Fallback Enforcement**: If a sentence cannot be grounded in an uploaded source document chunk, the verifier either re-prompts the LLM to rewrite using only retrieved evidence or strips the ungrounded statement.

---

## 5. SQL Database Schema & Memory Persistence

### Database Tables (PostgreSQL / SQLite)

1. **`documents`**:
   - `id`: UUID (Primary Key)
   - `workspace_id`: UUID
   - `file_name`: VARCHAR(255)
   - `total_pages`: INT
   - `created_at`: TIMESTAMP

2. **`document_chunks`**:
   - `id`: UUID (Primary Key)
   - `document_id`: UUID (Foreign Key)
   - `page_number`: INT
   - `paragraph_number`: INT
   - `chunk_text`: TEXT
   - `embedding`: VECTOR(1024)

3. **`chat_messages`**:
   - `id`: UUID (Primary Key)
   - `workspace_id`: UUID
   - `role`: VARCHAR(20)
   - `content`: TEXT
   - `citations`: JSONB (List of CitationMetadata)
   - `created_at`: TIMESTAMP

4. **`reports`**:
   - `id`: UUID (Primary Key)
   - `workspace_id`: UUID
   - `title`: VARCHAR(255)
   - `content_markdown`: TEXT
   - `citations`: JSONB (All structured citations)
   - `created_at`: TIMESTAMP

5. **`checkpoints` & `checkpoint_blobs`** (LangGraph Managed Tables):
   - Managed automatically by `AsyncPostgresSaver` / `SqliteSaver` to persist entire state trees.
