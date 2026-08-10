import logging
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.agents.report_graph import report_graph_app

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/reports", tags=["reports"])

class ReportGenerateRequest(BaseModel):
    prompt: str
    selected_docs: Optional[List[str]] = None
    session_id: Optional[str] = "report_session_1"

@router.post("/generate")
async def generate_report(request: ReportGenerateRequest):
    """Triggers LangGraph multi-agent workflow to generate policy report asynchronously in parallel."""
    session_id = request.session_id or "report_session_1"
    prompt = request.prompt
    selected_docs = request.selected_docs or []
    
    logger.info(f"Starting LangGraph Parallel Report Generation for prompt: '{prompt}'")
    
    initial_state = {
        "session_id": session_id,
        "user_prompt": prompt,
        "selected_docs": selected_docs,
        "outline": [],
        "section_drafts": {},
        "verified_citations": [],
        "final_report_md": "",
        "current_step": "Initializing",
        "is_completed": False
    }
    
    config = {"configurable": {"thread_id": session_id}}
    
    try:
        final_state = await report_graph_app.ainvoke(initial_state, config=config)
        
        return {
            "status": "success",
            "session_id": session_id,
            "outline": final_state.get("outline", []),
            "report_markdown": final_state.get("final_report_md", ""),
            "citations": final_state.get("verified_citations", []),
            "current_step": final_state.get("current_step", "Completed")
        }
    except Exception as e:
        logger.error(f"Error in LangGraph Report Generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Report Generation Error: {str(e)}")
