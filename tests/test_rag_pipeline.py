"""Complete RAG pipeline test"""

import pytest
from pathlib import Path
from dotenv import load_dotenv

from core.self_rag import SelfRAG
from core.retrieval import LangChainEmbeddingModel, VectorRetriever
from core.reranker import LangChainReranker
from core.critic import GroqCritic
from core.generator import GroqGenerator

load_dotenv()


@pytest.fixture
def test_rag_system():
    """Create a complete RAG system for testing"""
    embed_model = LangChainEmbeddingModel()
    retriever = VectorRetriever()
    reranker = LangChainReranker()
    critic = GroqCritic()
    generator = GroqGenerator()

    return SelfRAG(
        embed_model=embed_model,
        retriever=retriever,
        reranker=reranker,
        critic=critic,
        generator=generator,
        top_k=10,
        top_n=3,
    )


def test_complete_rag_pipeline(test_rag_system):
    """Test the complete RAG pipeline from query to answer"""
    # Test query about regulatory compliance
    test_queries = [
        "What are the capital requirements for banks in Nigeria?",
        "How does Basel III affect small financial institutions?",
        "What are the consumer protection regulations for credit?",
    ]

    for query in test_queries:
        result = test_rag_system.run(query)

        # Verify response structure
        assert "run_id" in result
        assert "answer" in result
        assert "provenance_meta" in result

        answer = result["answer"]
        assert "explanation" in answer
        assert "citations" in answer
        assert "confidence" in answer

        # Verify provenance logging
        assert "audit_id" in result
        assert Path(result["audit_id"]).exists()
