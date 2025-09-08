# 📘 CreditExplain RAG

**Evidence-backed, auditable explanations for credit decisions — with citations, PII-safety, and regulator-ready audit trails.**

Built for the **NSK.AI RAG Hackathon 2025**, CreditExplain RAG helps **compliance officers and analysts** quickly answer:

* *“Why was this loan declined?”*
* *“Which clause justifies KYC step X?”*

The system integrates advanced **RAG techniques** (SELF-RAG critic loop, reranking, provenance logging, PII redaction) to provide trustworthy, auditable explanations.

---

## ✨ Features

* 🔍 **Adaptive Retrieval (SELF-RAG):** Critic decides if/when to retrieve; reflection tokens (`ISREL`, `ISSUP`, `ISUSE`) score evidence.
* 📑 **Evidence-backed Explanations:** Every answer cites chunks from regulatory docs, T\&Cs, or policies.
* 🛡️ **PII Redaction:** Personal data filtered out before display.
* 📊 **Audit & Metrics:** Downloadable audit JSON/PDF with provenance; dashboards for retrieval precision and ISSUP distribution.
* 💡 **Follow-up Suggestions:** Sidebar with prioritized next questions.
* 🖥️ **Simple UI:** Sleek React web app — *Ingest Documents* and *Query Agent*.

---

## 📂 Repository Layout

```bash
creditexplain/
├── api/                   # FastAPI backend
│   ├── main.py            # Entrypoint: defines app, mounts routers
│   ├── safety.py          # PII redaction middleware
│   ├── dependencies.py    # Common dependencies (e.g., DB, settings)
│
├── core/                  # Orchestrator, RAG loop, prompts
│   ├── self_rag.py
│   ├── retrieval.py
│   ├── prompts.py
│   └── provenance.py
│
├── ingest/                # Loaders, chunking, embedding pipeline
│   ├── loader.py
│   ├── chunker.py
│   ├── index.py
│   └── normalize.py
│
├── models/                # Critic & reranker configurations
│   ├── critic.py
│   └── reranker.py
│
├── vectorstore/           # Persisted vector DB (Chroma or FAISS)
│
├── eval/                  # Metrics & audit evaluations
│   ├── metrics.py
│   └── runs/
│
├── data/                  # Sample input documents (not versioned)
│
├── diagrams/              # Architecture diagrams
│
├── frontend/              # React + Vite UI
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Upload.tsx
│   │   │   ├── Query.tsx
│   │   │   └── Metrics.tsx
│   │   ├── components/
│   │   │   ├── ExplanationCard.tsx
│   │   │   ├── CitationPreview.tsx
│   │   │   └── SidebarQuestions.tsx
│   │   └── api/axios.ts
│   ├── vite.config.ts
│   ├── package.json
│   └── tailwind.config.js
│
├── requirements.txt
├── Dockerfile
├── Makefile
├── README.md
└── .env.example
```

---

## 🛠️ Setup

### 1. Clone & install

```bash
git clone https://github.com/<your-org>/creditexplain.git
cd creditexplain
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment

Copy `.env.example` → `.env` and fill in your keys:

```bash
OPENAI_API_KEY=sk-xxxx
CHROMA_PERSIST_DIR=./vectorstore/chroma
EMBEDDINGS_FALLBACK=all-mpnet-base-v2
RERANKER_MODEL=cross-encoder/ms-marco-MiniLM-L-6-v2
```

### 3. Ingest documents

```bash
# Place PDFs in data/raw/
make ingest
```

### 4. Run the app

```bash
make run
# React UI starts at http://localhost:8501
```

---

## 🚀 Usage

1. Go to **Page A (Ingest Docs)** — upload regulatory PDFs or product T\&Cs.
2. Switch to **Page B (Query Agent)** — ask queries like:

   * “Why was loan X declined?”
   * “Which clause justifies KYC Step Y?”
3. Review:

   * Explanation (with citations)
   * Confidence scores (ISREL/ISSUP/ISUSE)
   * Redacted evidence chunks
   * Suggested follow-up questions
4. Export **Audit JSON/PDF** for compliance traceability.

---

## 📊 Evaluation & Metrics

Metrics are logged to `eval/runs/` and summarized in dashboards:

* **Retrieval Precision (P\@1, P\@3)**
* **Mean Reciprocal Rank (MRR)** (with vs without reranker)
* **Citation precision**
* **ISSUP distribution** (evidence support)
* **Latency breakdown**

Example run:

```bash
make eval
# Produces eval/runs/demo.json and summary charts
```

---

## 🧑‍🤝‍🧑 Team & Roles

* **Role A – Data & Ingestion Lead**

  * Ingestion, chunking, embeddings, vector DB
* **Role B – Reasoning Core Lead**

  * SELF-RAG critic, retriever/reranker, generator, provenance
* **Role C – UI & Safety Lead**

  * Streamlit UI, PII redaction, metrics, audit exports

---

## 🎥 Demo & Presentation

* **Demo Video (2–3 min):** \[link placeholder]
* **Architecture Diagram:** [`diagrams/creditexplain_infra.png`](./diagrams/creditexplain_infra.png)
* **Data Flow Chart (with examples):** [`diagrams/creditexplain_dataflow.png`](./diagrams/creditexplain_dataflow.png)

---

## 📜 License

MIT License (see [LICENSE](./LICENSE)).

---
