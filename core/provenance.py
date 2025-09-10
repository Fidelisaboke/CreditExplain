import os, json, time
from typing import Any, Dict

AUDIT_DIR = "./audit/"
os.makedirs(AUDIT_DIR, exist_ok=True)

def write_audit(run_id: str, query: str, top_candidates: list, answer_or_selection: Any, provenance_meta: dict, latency_s: float, case_id: str = None) -> str:
    audit = {
        "run_id": run_id,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "case_id": case_id,
        "query": query,
        "top_candidates": [{ "id":c['id'], "metadata": c.get('metadata')} for c in top_candidates],
        "result": answer_or_selection,
        "provenance_meta": provenance_meta,
        "latency_s": latency_s
    }
    path = os.path.join(AUDIT_DIR, f"audit_{run_id}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(audit, f, indent=2)
    return path
