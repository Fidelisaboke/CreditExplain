from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from self_rag import SelfRAG
import uvicorn
import shutil
import os
import json


UPLOAD_DIR = "./data/raw"
INTERIM_DIR = "./data/interim"
METRICS_PATH = "./eval/runs/demo.json"

app = FastAPI(title="CreditExplain API")

# instantiate SelfRAG once
rag = SelfRAG()


class QueryIn(BaseModel):
    query: str
    case_id: Optional[str] = None

# Document upload endpoint
@app.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Upload one or more PDF documents for ingestion.
    """
    saved_files = []
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_files.append(file.filename)
    # Optionally trigger ingestion pipeline here
    return {"uploaded": saved_files}

# List ingested documents endpoint
@app.get("/documents")
async def list_documents():
    """
    List all processed documents and their metadata.
    """
    docs = []
    if not os.path.exists(UPLOAD_DIR):
        return {"documents": docs}
    for fname in os.listdir(UPLOAD_DIR):
        if fname.endswith(".pdf"):
            docs.append({"filename": fname})
    return {"documents": docs}

# Metrics endpoint
@app.get("/metrics")
async def get_metrics():
    """
    Return system metrics for dashboard visualization.
    """
    if not os.path.exists(METRICS_PATH):
        raise HTTPException(status_code=404, detail="Metrics not found.")
    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)
    return metrics

# PII redaction stats endpoint (optional)
@app.get("/pii-stats")
async def get_pii_stats():
    """
    Return PII redaction statistics.
    """
    # Example: Load from a log or DB
    stats = {
        "total_redactions": 156,
        "documents_scanned": 28
    }
    return stats

# Document metadata endpoint (optional)
@app.get("/documents/{filename}")
async def get_document_metadata(filename: str):
    """
    Return metadata for a specific document.
    """
    meta_path = os.path.join(INTERIM_DIR, f"{filename}.json")
    if not os.path.exists(meta_path):
        raise HTTPException(status_code=404, detail="Metadata not found.")
    with open(meta_path, "r") as f:
        metadata = json.load(f)
    return metadata

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
