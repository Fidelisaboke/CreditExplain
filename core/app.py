from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from self_rag import SelfRAG
import uvicorn

app = FastAPI(title="CreditExplain API")

# instantiate SelfRAG once
rag = SelfRAG()

class QueryIn(BaseModel):
    query: str
    case_id: Optional[str] = None

@app.post("/query")
async def query_endpoint(payload: QueryIn):
    try:
        resp = rag.run(payload.query, case_id=payload.case_id)
        return resp
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audit/{run_id}")
async def get_audit(run_id: str):
    import os, json
    path = f"./audit/audit_{run_id}.json"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="audit not found")
    with open(path,'r') as f:
        return json.load(f)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
