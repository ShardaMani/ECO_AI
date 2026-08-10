import os
import logging
from typing import List, Dict, Any
from fastapi import HTTPException
from langchain_community.vectorstores import Chroma
from app.services.nvidia_llm import get_nvidia_embeddings, validate_nvidia_api_key

logger = logging.getLogger(__name__)

class VectorStoreManager:
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        self._vector_store = None

    def get_vector_store(self) -> Chroma:
        """Returns initialized Chroma vector store powered by NVIDIA Embeddings."""
        if self._vector_store is None:
            embeddings = get_nvidia_embeddings()
            self._vector_store = Chroma(
                collection_name="ecoresearch_docs",
                embedding_function=embeddings,
                persist_directory=self.persist_directory
            )
        return self._vector_store

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        """Adds document chunks with rich metadata to vector database."""
        if not chunks:
            return
            
        texts = [chunk["text"] for chunk in chunks]
        metadatas = [
            {
                "chunk_id": chunk["chunk_id"],
                "doc_id": chunk["doc_id"],
                "file_name": chunk["file_name"],
                "page_number": chunk["page_number"],
                "paragraph_number": chunk["paragraph_number"],
                "total_pages": chunk["total_pages"]
            }
            for chunk in chunks
        ]
        ids = [chunk["chunk_id"] for chunk in chunks]
        
        try:
            vector_store = self.get_vector_store()
            vector_store.add_texts(texts=texts, metadatas=metadatas, ids=ids)
            try:
                vector_store.persist()
            except Exception:
                pass
            logger.info(f"Successfully indexed {len(chunks)} chunks into vector store using NVIDIA Embeddings.")
        except Exception as e:
            err_msg = str(e)
            logger.error(f"Error indexing chunks with NVIDIA Embeddings: {err_msg}")
            
            if "401" in err_msg or "Unauthorized" in err_msg:
                raise HTTPException(
                    status_code=401,
                    detail="NVIDIA API Key Authorization Failed (401 Unauthorized). Check backend/.env key."
                )
            
            raise HTTPException(status_code=500, detail=f"Vector Storage Error: {err_msg}")

    def search_similar(self, query: str, top_k: int = 8, doc_filter: List[str] = None) -> List[Dict[str, Any]]:
        """Searches vector store for relevant chunks using similarity_search with automatic fallback."""
        try:
            vector_store = self.get_vector_store()
            
            filter_dict = None
            if doc_filter and len(doc_filter) > 0:
                if len(doc_filter) == 1:
                    filter_dict = {"file_name": doc_filter[0]}
                else:
                    filter_dict = {"file_name": {"$in": doc_filter}}
                    
            results = vector_store.similarity_search_with_score(
                query=query,
                k=top_k,
                filter=filter_dict
            )
            
            # Fallback: If filtered search returns no chunks, search across all documents
            if not results and filter_dict is not None:
                logger.info("Filtered search returned 0 chunks. Executing fallback search across full vector corpus...")
                results = vector_store.similarity_search_with_score(
                    query=query,
                    k=top_k
                )

            retrieved_chunks = []
            for doc, score in results:
                retrieved_chunks.append({
                    "text": doc.page_content,
                    "metadata": doc.metadata,
                    "score": float(score)
                })
                
            logger.info(f"Retrieved {len(retrieved_chunks)} relevant chunks for query: '{query}'")
            return retrieved_chunks
        except Exception as e:
            err_msg = str(e)
            if "401" in err_msg or "Unauthorized" in err_msg:
                raise HTTPException(
                    status_code=401,
                    detail="NVIDIA API Key Authorization Failed (401 Unauthorized). Check backend/.env key."
                )
            raise e

vector_store_manager = VectorStoreManager()
