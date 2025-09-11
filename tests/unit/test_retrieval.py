import pytest
import numpy as np
from unittest.mock import Mock, patch, MagicMock
from core.retrieval import VectorRetriever


def test_vector_retriever_initialization():
    """Test that VectorRetriever initializes without errors."""
    with patch("core.retrieval.HuggingFaceEmbeddings") as mock_embeddings, patch(
        "core.retrieval.Chroma"
    ) as mock_chroma:

        mock_embeddings_instance = Mock()
        mock_embeddings.return_value = mock_embeddings_instance

        mock_chroma_instance = Mock()
        mock_chroma.return_value = mock_chroma_instance

        retriever = VectorRetriever(persist_directory="./test_vectorstore")
        assert retriever.vector_store is not None
        mock_chroma.assert_called_once()


@patch("core.retrieval.logger")
def test_retrieve_error_handling(mock_logger):
    """Test that retrieval errors are logged and handled."""
    with patch("core.retrieval.HuggingFaceEmbeddings") as mock_embeddings, patch(
        "core.retrieval.Chroma"
    ) as mock_chroma:

        mock_embeddings_instance = Mock()
        mock_embeddings.return_value = mock_embeddings_instance

        mock_chroma_instance = Mock()
        mock_chroma.return_value = mock_chroma_instance

        retriever = VectorRetriever()

        # Mock similarity_search_by_vector to raise an exception
        mock_chroma_instance.similarity_search_by_vector.side_effect = Exception(
            "Test error"
        )

        result = retriever.retrieve([1.0, 2.0, 3.0], k=10)

        assert result == []
        mock_logger.error.assert_called()


def test_retrieve_by_text():
    """Test text-based retrieval method."""
    with patch("core.retrieval.HuggingFaceEmbeddings") as mock_embeddings, patch(
        "core.retrieval.Chroma"
    ) as mock_chroma:

        mock_embeddings_instance = Mock()
        mock_embeddings.return_value = mock_embeddings_instance

        mock_chroma_instance = Mock()
        mock_chroma.return_value = mock_chroma_instance

        # Mock successful retrieval
        mock_doc = Mock()
        mock_doc.page_content = "Test document content"
        mock_doc.metadata = {"source": "test.pdf", "id": "doc123"}
        mock_chroma_instance.similarity_search.return_value = [mock_doc]

        retriever = VectorRetriever()
        results = retriever.retrieve_by_text("test query", k=5)

        assert len(results) == 1
        assert results[0]["doc_text"] == "Test document content"
