import os
import uuid
import logging
import pypdf
from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)

class DocumentIngestionService:
    def __init__(self):
        # Target ~150 tokens (approx 500 chars) to strictly comply with NVIDIA's 512 token ceiling
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

    def extract_text_from_pdf(self, file_path: str, file_name: str) -> List[Dict[str, Any]]:
        """Extracts text page-by-page from PDF with page and paragraph metadata."""
        logger.info(f"Extracting PDF text from: {file_name}")
        chunks_with_metadata = []
        
        try:
            reader = pypdf.PdfReader(file_path)
            total_pages = len(reader.pages)
            doc_id = str(uuid.uuid4())
            
            for page_idx, page in enumerate(reader.pages):
                page_number = page_idx + 1
                page_text = page.extract_text() or ""
                
                if not page_text.strip():
                    continue
                    
                # Split page text using character splitter
                raw_chunks = self.text_splitter.split_text(page_text)
                
                for chunk_idx, raw_chunk in enumerate(raw_chunks):
                    clean_chunk = raw_chunk.strip()
                    if not clean_chunk:
                        continue
                        
                    # HARD SAFETY TRUNCATION: Max 500 characters per chunk
                    # 500 chars guarantees <= 300 tokens, comfortably below NVIDIA's 512 token limit
                    sub_splits = [clean_chunk[i:i+500] for i in range(0, len(clean_chunk), 450)]
                    
                    for sub_text in sub_splits:
                        if not sub_text.strip():
                            continue
                        chunks_with_metadata.append({
                            "chunk_id": str(uuid.uuid4()),
                            "doc_id": doc_id,
                            "file_name": file_name,
                            "page_number": page_number,
                            "paragraph_number": chunk_idx + 1,
                            "total_pages": total_pages,
                            "text": sub_text.strip()
                        })
                        
            logger.info(f"Successfully processed {file_name}: {total_pages} pages, {len(chunks_with_metadata)} chunks created.")
            return chunks_with_metadata
            
        except Exception as e:
            logger.error(f"Error processing PDF {file_name}: {str(e)}")
            raise e

    def process_batch_files(self, file_tuples: List[tuple[str, str]]) -> List[Dict[str, Any]]:
        """Processes multiple uploaded files (20-50+ papers) in batch."""
        all_chunks = []
        for file_path, file_name in file_tuples:
            if file_name.endswith(".pdf"):
                chunks = self.extract_text_from_pdf(file_path, file_name)
                all_chunks.extend(chunks)
            else:
                logger.warning(f"Unsupported file type for {file_name}, skipping.")
        return all_chunks

ingestion_service = DocumentIngestionService()
