import os
import shutil
import logging
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ingestion import ingestion_service
from app.services.vector_store import vector_store_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/documents", tags=["documents"])

TEMP_UPLOAD_DIR = "./temp_uploads"
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_batch_documents(files: List[UploadFile] = File(...)):
    """Batch uploads up to 50+ research papers (PDF format) and indexes into vector store."""
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    saved_file_tuples = []
    
    for file in files:
        file_path = os.path.join(TEMP_UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_file_tuples.append((file_path, file.filename))
        
    logger.info(f"Received batch upload of {len(files)} files.")
    
    try:
        # Process text extraction & chunking
        all_chunks = ingestion_service.process_batch_files(saved_file_tuples)
        
        # Index into vector database (Calls NVIDIA Embeddings API)
        vector_store_manager.add_chunks(all_chunks)
        
        # Extract unique document names processed
        processed_files = list(set([c["file_name"] for c in all_chunks]))
        
        return {
            "status": "success",
            "message": f"Successfully ingested and indexed {len(processed_files)} documents ({len(all_chunks)} text chunks).",
            "documents": processed_files,
            "total_chunks": len(all_chunks)
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error during upload_batch_documents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temp files
        for file_path, _ in saved_file_tuples:
            try:
                os.remove(file_path)
            except Exception:
                pass

@router.get("/list")
async def list_documents():
    """Lists indexed document collections."""
    try:
        store = vector_store_manager.get_vector_store()
        collection = store._collection.get()
        metadatas = collection.get("metadatas", [])
        
        doc_summary = {}
        for meta in metadatas:
            file_name = meta.get("file_name")
            if file_name:
                if file_name not in doc_summary:
                    doc_summary[file_name] = {
                        "file_name": file_name,
                        "total_pages": meta.get("total_pages", 1),
                        "chunks_count": 0
                    }
                doc_summary[file_name]["chunks_count"] += 1
                
        return {
            "documents": list(doc_summary.values()),
            "total_documents": len(doc_summary)
        }
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}")
        return {"documents": [], "total_documents": 0}
