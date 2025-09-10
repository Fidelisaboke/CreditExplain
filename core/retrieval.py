import os
import numpy as np
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# Simple embedding wrapper
class EmbeddingModel:
    def __init__(self, model_name: str = "all-mpnet-base-v2"):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)

    def embed(self, texts: List[str]) -> np.ndarray:
        return self.model.encode(texts, show_progress_bar=False, convert_to_numpy=True)

# Retriever wrapper for a Chroma collection
class VectorRetriever:
    def __init__(self, persist_dir: str = "./vectorstore/chroma", collection_name: str = "creditexplain"):
        # Configure Chroma client (local filesystem persistence)
        settings = Settings(chroma_db_impl="duckdb+parquet", persist_directory=persist_dir)
        self.client = chromadb.Client(settings)
        # Use existing collection; assume Role A created it
        self.collection = self.client.get_collection(collection_name)

    def retrieve(self, query_embedding: np.ndarray, k: int = 50) -> List[Dict[str, Any]]:
        # Chroma expects list of embeddings
        result = self.collection.query(query_embeddings=[query_embedding.tolist()], n_results=k,
                                       include=['ids','metadatas','documents','distances'])
        # result is a dictionary of lists; standardize into list of dicts
        items = []
        for i in range(len(result['ids'][0])):
            items.append({
                "id": result['ids'][0][i],
                "doc_text": result['documents'][0][i],
                "metadata": result['metadatas'][0][i],
                "distance": result['distances'][0][i]
            })
        return items

# Convenience function
def get_topk_for_query(query: str, embed_model: EmbeddingModel, retriever: VectorRetriever, k: int = 50):
    q_emb = embed_model.embed([query])[0]
    return retriever.retrieve(q_emb, k=k)
