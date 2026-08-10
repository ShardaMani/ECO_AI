import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class WorkspaceModel(Base):
    __tablename__ = "workspaces"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("DocumentModel", back_populates="workspace", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessageModel", back_populates="workspace", cascade="all, delete-orphan")
    reports = relationship("ReportModel", back_populates="workspace", cascade="all, delete-orphan")

class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(Text, nullable=True)
    total_pages = Column(Integer, default=1)
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    workspace = relationship("WorkspaceModel", back_populates="documents")

class ChatMessageModel(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    session_id = Column(String(36), nullable=False)
    role = Column(String(20), nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    citations = Column(JSON, nullable=True) # List of verified citation objects
    created_at = Column(DateTime, default=datetime.utcnow)

    workspace = relationship("WorkspaceModel", back_populates="chat_messages")

class ReportModel(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    title = Column(String(255), nullable=False)
    outline = Column(JSON, nullable=True)
    content_markdown = Column(Text, nullable=False)
    citations = Column(JSON, nullable=True)
    status = Column(String(50), default="completed") # 'drafting', 'completed'
    created_at = Column(DateTime, default=datetime.utcnow)

    workspace = relationship("WorkspaceModel", back_populates="reports")
