import pytest
from unittest.mock import Mock, patch


@pytest.fixture
def mock_chroma_client():
    """Mock Chroma client for tests."""
    with patch('chromadb.PersistentClient') as mock_client:
        mock_collection = Mock()
        mock_collection.query.return_value = {
            'ids': [['doc1', 'doc2']],
            'documents': [['text1', 'text2']],
            'metadatas': [[{'source': 'test1'}, {'source': 'test2'}]],
            'distances': [[0.1, 0.2]]
        }
        mock_client.return_value.get_collection.return_value = mock_collection
        mock_client.return_value.create_collection.return_value = mock_collection
        yield mock_client