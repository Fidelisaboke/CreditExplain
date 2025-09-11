"""Test ingestion components: loader, chunker, normalizer, indexer"""
import pytest
from pathlib import Path
from ingest.loader import CreditDocumentLoader
from ingest.chunker import RegulatoryChunker
from ingest.normalize import normalize_text, detect_pii
from ingest.index import build_vectorstore
from langchain_core.documents import Document

from dotenv import load_dotenv

load_dotenv()

def test_normalize_pii_redaction():
    """Test PII redaction works correctly"""
    text = "Contact john@example.com at 555-123-4567 for SSN 123-45-6789"
    normalized = normalize_text(text)
    
    assert "[EMAIL]" in normalized
    assert "[PHONE]" in normalized  
    assert "[SSN]" in normalized
    assert "john@example.com" not in normalized

def test_chunker_regulatory_documents():
    """Test chunker handles regulatory documents properly"""
    chunker = RegulatoryChunker(chunk_size=500, chunk_overlap=50)
    
    sample_doc = Document(
        page_content="ARTICLE 1: Definitions. Clause 1: Bank means any financial institution...",
        metadata={"source": "test.pdf"}
    )
    
    chunks = chunker.chunk_documents([sample_doc])
    assert len(chunks) > 0
    assert "ARTICLE" in chunks[0].page_content