import time, uuid, json
from typing import List, Dict
from retrieval import EmbeddingModel, VectorRetriever, get_topk_for_query
from reranker import Reranker
from generator import Generator
from critic import OpenAICritic
from provenance import write_audit

class SelfRAG:
    def __init__(self, embed_model=None, retriever=None, reranker=None, generator=None, critic=None, top_k=50, top_n=6):
        self.embed_model = embed_model or EmbeddingModel()
        self.retriever = retriever or VectorRetriever()
        self.reranker = reranker or Reranker()
        self.generator = generator or Generator()
        self.critic = critic or OpenAICritic()
        self.top_k = top_k
        self.top_n = top_n
        # selection weights default
        self.w_isrel = 0.45
        self.w_issup = 0.40
        self.w_isuse = 0.15
        self.fully_supported_threshold = 0.7

    def run(self, query: str, case_id: str = None) -> Dict:
        run_id = str(uuid.uuid4())
        start = time.time()

        # 1) Critic: decide whether to retrieve
        decision = self.critic.decide_retrieve(query)
        if not decision.get("retrieve", True):
            # fallback: short generated response with no retrieval (rare for our use-case)
            gen = self.generator.generate_from_passages(query, [])
            audit = write_audit(run_id, query, [], gen, decision, time.time()-start, case_id)
            return {"run_id": run_id, "answer": gen, "audit_id": audit}

        # 2) Retrieve top-K
        q_emb = self.embed_model.embed([query])[0]
        candidates = self.retriever.retrieve(q_emb, k=self.top_k)

        # 3) Rerank to top-N
        top_candidates, rerank_scores = self.reranker.rerank(query, candidates, top_n=self.top_n)

        # 4) For each top candidate create a generator prompt and generate candidate answer (one per passage)
        candidate_results = []
        for cand in top_candidates:
            gen = self.generator.generate_from_passages(query, [cand])
            # 5) Critic scoring per candidate
            score = self.critic.score_candidate(query, gen.get("explanation",""), cand['doc_text'])
            combined_score = self.w_isrel*score.get("isrel",0.0) + self.w_issup*score.get("issup",0.0) + self.w_isuse*score.get("isuse",0.0)
            candidate_results.append({
                "candidate": gen,
                "passage": cand,
                "score_components": score,
                "combined_score": combined_score
            })

        # 6) Select best
        candidate_results.sort(key=lambda x: x['combined_score'], reverse=True)
        best = candidate_results[0]
        # if best ISSUP < threshold, return request_more_docs
        if best['score_components'].get("issup",0.0) < self.fully_supported_threshold:
            selection = {"status":"insufficient_support", "message":"Support for answer insufficient; request more documents", "candidates": candidate_results}
            audit_id = write_audit(run_id, query, top_candidates, selection, {"retrieve":True}, time.time()-start, case_id)
            return {"run_id": run_id, "selection": selection, "audit_id": audit_id}

        # 7) Success: write audit and return
        answer = best['candidate']
        provenance = {
            "used_chunks": [best['passage']['id']],
            "scores": best['score_components'],
            "combined_score": best['combined_score']
        }
        audit_id = write_audit(run_id, query, top_candidates, answer, provenance, time.time()-start, case_id)
        return {"run_id": run_id, "answer": answer, "provenance": provenance, "audit_id": audit_id}
