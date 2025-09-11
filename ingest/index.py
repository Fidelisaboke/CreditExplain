"""
Vector store indexing for CreditExplain RAG system.
Uses free/open-source embedding models as specified in project requirements.
"""

import os
import sys
import logging
from typing import Optional, Callable
from langchain_core.documents import Document
from langchain_chroma import Chroma

# Use LangChain's HuggingFace embeddings instead of OpenAI
from langchain_huggingface import HuggingFaceEmbeddings

# Import your improved components
from ingest.loader import CreditDocumentLoader
from ingest.chunker import RegulatoryChunker
from ingest.normalize import normalize_documents, normalize_rules  # Enhanced normalization

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def build_vectorstore(
    data_dir: str = "data/raw",
    persist_dir: str = "../vectorstore/chroma",
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    device: str = "cpu",
    normalize: bool = True
) -> Chroma:
    """
    Build vector store from regulatory documents using free/open-source models.
    
    Args:
        data_dir: Directory containing regulatory documents (PDFs, JSON, etc.)
        persist_dir: Directory to persist the vector store
        embedding_model_name: Name of the free embedding model to use
        chunk_size: Size of text chunks for processing
        chunk_overlap: Overlap between chunks for context preservation
        device: Device to use for embeddings ('cpu' or 'cuda')
        normalize: Whether to apply PII redaction and normalization
        
    Returns:
        Chroma vector store instance
    """
    # Validate inputs
    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"Data directory not found: {data_dir}")
    
    # Create output directory if it doesn't exist
    os.makedirs(persist_dir, exist_ok=True)
    
    logger.info("Starting vector store build process...")
    logger.info(f"Using embedding model: {embedding_model_name} on {device}")

    try:
        # 1. Load documents using improved loader
        logger.info("Loading documents...")
        loader = CreditDocumentLoader(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        
        documents = loader.load_documents(data_dir)
        logger.info(f"Loaded {len(documents)} documents")
        
        if not documents:
            raise ValueError("No documents found or loaded from the data directory")
        
        # 2. Apply PII redaction and normalization
        if normalize:
            logger.info("Applying PII redaction and normalization...")
            documents = normalize_documents(documents)
            logger.info("Completed document normalization")
        
        # 3. Chunk documents with regulatory-aware chunker
        logger.info("Chunking documents...")
        chunker = RegulatoryChunker(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        
        chunks = chunker.chunk_documents(documents)
        logger.info(f"Created {len(chunks)} chunks from {len(documents)} documents")
        
        # 4. Initialize FREE embedding model (no API key required)
        logger.info(f"Initializing embedding model: {embedding_model_name}")
        embeddings = HuggingFaceEmbeddings(
            model_name=embedding_model_name,
            model_kwargs={'device': device},
            encode_kwargs={'normalize_embeddings': True}  # Enable normalization for better results
        )
        
        # 5. Create and persist vector store
        logger.info("Building vector store...")
        vectordb = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=persist_dir,
            collection_name="creditexplain"
        )
        
        logger.info(f"✅ Vector store built and persisted at {persist_dir}")
        
        # Show statistics
        collection = vectordb._collection
        if collection:
            count = collection.count()
            logger.info(f"📊 Vector store contains {count} document chunks")
        
        return vectordb
        
    except Exception as e:
        logger.error(f"Failed to build vector store: {e}")
        raise

def build_from_rules_file(
    rules_file: str = "data/interim/rules.json",
    persist_dir: str = "vectorstore/chroma",
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
    device: str = "cpu",
    load_rules_func: Optional[Callable] = None,
    chunk_rules_func: Optional[Callable] = None
) -> Chroma:
    """
    Alternative method: Build from existing rules JSON file (backward compatibility).
    """
    if not os.path.exists(rules_file):
        raise FileNotFoundError(f"Rules file not found: {rules_file}")
    
    # Use provided functions or import locally to avoid circular imports
    if load_rules_func is None:
        from ingest.loader import load_rules as load_rules_func
    if chunk_rules_func is None:
        from ingest.chunker import chunk_rules as chunk_rules_func
    
    # Load and normalize rules
    rules = load_rules_func(rules_file)
    rules = normalize_rules(rules)  # Using the enhanced normalize_rules
    
    # Chunk rules
    chunks = chunk_rules_func(rules)
    
    # Convert to LangChain Documents
    docs = [
        Document(
            page_content=chunk["text"],
            metadata={k: v for k, v in chunk.items() if k != "text"}
        )
        for chunk in chunks
    ]
    
    # Initialize FREE embedding model
    embeddings = HuggingFaceEmbeddings(
        model_name=embedding_model_name,
        model_kwargs={'device': device},
        encode_kwargs={'normalize_embeddings': True}
    )
    
    # Build vector store
    vectordb = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=persist_dir,
        collection_name="creditexplain"
    )
    
    logger.info(f"✅ Vector store built from rules file and persisted at {persist_dir}")
    
    return vectordb

def check_vectorstore_health(
    persist_dir: str = "../vectorstore/chroma",
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
    collection_name: str = "creditexplain"
) -> dict:
    """
    Check the health and status of the vector store.
    
    Returns:
        Dictionary with vector store health information
    """
    try:
        embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name)
        
        vectordb = Chroma(
            persist_directory=persist_dir,
            embedding_function=embeddings,
            collection_name=collection_name
        )
        
        count = vectordb._collection.count() if vectordb._collection else 0
        
        return {
            "status": "healthy",
            "document_count": count,
            "persist_directory": persist_dir,
            "model": embedding_model_name,
            "collection_name": vectordb._collection.name if vectordb._collection else "unknown"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "persist_directory": persist_dir
        }

if __name__ == "__main__":
    # Build from raw documents (recommended)
    try:
        db = build_vectorstore(
            data_dir="data/raw",
            persist_dir="../vectorstore/chroma",
            embedding_model_name="sentence-transformers/all-MiniLM-L6-v2",
            device="cpu",  # Change to "cuda" if GPU available
            normalize=True  # Enable PII redaction
        )
        
        # Check health
        health = check_vectorstore_health()
        print(f"✅ Vector store health: {health}")
        
    except Exception as e:
        print(f"❌ Failed to build vector store: {e}")
        sys.exit(1)
        