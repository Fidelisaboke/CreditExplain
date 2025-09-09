import os
import sys
from langchain.docstore.document import Document
from langchain.vectorstores import Chroma

try:
    from langchain.embeddings import OpenAIEmbeddings  # old versions
except ImportError:
    from langchain_openai import OpenAIEmbeddings       # new versions

from ingest.loader import load_rules
from ingest.chunker import chunk_rules
from ingest.normalize import normalize_rules


def build_vectorstore(rules_file="data/interim/rules.json", persist_dir="vectorstore/chroma"):
    if not os.path.exists(rules_file):
        raise FileNotFoundError(f"Rules file not found: {rules_file}")

    if "OPENAI_API_KEY" not in os.environ:
        raise EnvironmentError("Missing OPENAI_API_KEY in environment")

    # Load + normalize
    rules = load_rules(rules_file)
    rules = normalize_rules(rules)

    # Chunk
    chunks = chunk_rules(rules)

    # Prepare LangChain Documents
    docs = [
        Document(
            page_content=ch["text"],
            metadata={k: v for k, v in ch.items() if k != "text"}  # slim metadata
        )
        for ch in chunks
    ]

    # Build embeddings + Chroma store
    embeddings = OpenAIEmbeddings()
    vectordb = Chroma.from_documents(docs, embedding=embeddings, persist_directory=persist_dir)
    vectordb.persist()
    return vectordb


if __name__ == "__main__":
    db = build_vectorstore()
    print("✅ Vector store built and persisted at vectorstore/chroma")
