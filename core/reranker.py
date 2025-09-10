from sentence_transformers import CrossEncoder
from typing import List, Dict, Tuple

class Reranker:
    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model = CrossEncoder(model_name)

    def rerank(self, query: str, candidates: List[Dict], top_n: int = 6) -> Tuple[List[Dict], List[float]]:
        # candidates: list of {'id','doc_text','metadata','distance'}
        pairs = [(query, c['doc_text']) for c in candidates]
        scores = self.model.predict(pairs)  # higher = better
        # attach scores and sort
        for c, s in zip(candidates, scores):
            c['rerank_score'] = float(s)
        sorted_cands = sorted(candidates, key=lambda x: x['rerank_score'], reverse=True)
        return sorted_cands[:top_n], [c['rerank_score'] for c in sorted_cands[:top_n]]
