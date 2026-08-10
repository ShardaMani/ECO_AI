import logging
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.services.nvidia_llm import get_nvidia_chat_llm
from app.services.vector_store import vector_store_manager
from app.services.citation_engine import citation_engine

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatQueryRequest(BaseModel):
    query: str
    selected_docs: Optional[List[str]] = None
    session_id: Optional[str] = "default_session"

@router.post("/query")
async def chat_query(request: ChatQueryRequest):
    """Answers sustainability policy queries with mandatory inline citations."""
    query = request.query
    selected_docs = request.selected_docs or []
    
    logger.info(f"Processing chat query: '{query}' over docs: {selected_docs}")
    
    # Retrieve top 6 relevant vector chunks
    chunks = vector_store_manager.search_similar(query=query, top_k=6, doc_filter=selected_docs)
    
    if not chunks:
        return {
            "answer": "No relevant evidence found in the uploaded documents for your query. Please upload research papers covering this topic.",
            "citations": []
        }
        
    context_text = "\n\n".join([
        f"Source Document: {c['metadata'].get('file_name', 'Doc')} (Page {c['metadata'].get('page_number', 1)})\nContent: {c['text']}"
        for c in chunks
    ])
    
    system_prompt = (
        "You are EcoResearch AI, a specialized assistant for Sustainability Analysts and Policy Advisors. "
        "Answer the user query thoroughly using strictly the provided document context. "
        "CRITICAL INSTRUCTION: You MUST attach inline citations to every single claim or sentence, "
        "formatting them as [Document_Name.pdf, p. X]. Never omit inline citations."
    )
    user_message = f"User Query: {query}\n\nDocument Evidence:\n{context_text}\n\nDetailed Answer:"
    
    # Retry loop for transient API timeouts
    attempts = 0
    max_attempts = 2
    last_error = None

    while attempts < max_attempts:
        try:
            attempts += 1
            llm = get_nvidia_chat_llm(temperature=0.2)
            response = llm.invoke([
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ])
            
            # Enforce citation audit
            cited_response = citation_engine.build_cited_response(response.content, chunks)
            
            return {
                "answer": cited_response["text"],
                "citations": cited_response["citations"]
            }
        except Exception as e:
            last_error = str(e)
            logger.warning(f"Chat query attempt {attempts} failed: {last_error}")
            if "Read timed out" in last_error or "timeout" in last_error.lower():
                continue
            break
            
    logger.error(f"Error executing chat query LLM call: {last_error}")
    raise HTTPException(status_code=504, detail=f"NVIDIA API Response Timeout: {last_error}")
