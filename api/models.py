"""Pydantic models for API request and response schemas."""

from pydantic import BaseModel
from typing import List, Optional


class Citation(BaseModel):
    doc_id: str
    chunk_id: Optional[str] = None
    text_excerpt: str


class QueryResponse(BaseModel):
    explanation: str
    citations: List[Citation] = []
    confidence: str  # "HIGH", "MEDIUM", "LOW"
    follow_up_questions: Optional[List[str]] = None


class QueryIn(BaseModel):
    query: str
    case_id: Optional[str] = None
