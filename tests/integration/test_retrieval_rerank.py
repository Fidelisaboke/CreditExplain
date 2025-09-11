# tests/integration/test_retrieval_rerank.py
import pytest
import numpy as np
from unittest.mock import Mock, patch
from core.reranker import LangChainReranker


@pytest.fixture
def test_retriever():
    """Create a mock retriever with sample data"""
    # Mock the retriever
    mock_retriever = Mock()
    mock_retriever.retrieve.return_value = [
        {
            "id": "doc1_chunk1",
            "doc_text": "Banks must maintain minimum capital ratios as per Basel III guidelines.",
            "metadata": {"source": "basel_iii.pdf", "page": 12},
            "distance": 0.85,
        },
        {
            "id": "doc2_chunk3",
            "doc_text": "Capital requirements vary by jurisdiction and bank size.",
            "metadata": {"source": "regulation_guide.pdf", "page": 5},
            "distance": 0.92,
        },
    ]

    # Mock the embed model
    mock_embed_model = Mock()
    mock_embed_model.embed_query.return_value = np.array([0.1, 0.2, 0.3, 0.4])

    return mock_retriever, mock_embed_model


def test_retrieval_reranking_integration(test_retriever):
    """Test that retrieval and reranking work together"""
    retriever, embed_model = test_retriever
    reranker = LangChainReranker()

    query = "capital requirements for banks"
    query_embedding = embed_model.embed_query(query)

    # First stage: retrieval (mocked)
    initial_results = retriever.retrieve(query_embedding, k=20)
    assert len(initial_results) > 0

    # Second stage: reranking
    reranked, scores = reranker.rerank(query, initial_results, top_n=5)
    assert len(reranked) == 2
    assert all("rerank_score" in doc for doc in reranked)
