import json
from langchain.text_splitter import RecursiveCharacterTextSplitter

def chunk_rules(rules, chunk_size=1000, chunk_overlap=200):
    """
    Split rules into retrievable chunks.

    Args:
        rules (list[dict]): List of rules, each with at least {"text": str, "doc_id": str}.
        chunk_size (int): Max characters per chunk.
        chunk_overlap (int): Overlap between chunks.

    Returns:
        list[dict]: Chunked rules with metadata.
    """
    # --- Basic validation ---
    if not isinstance(rules, list):
        raise ValueError("Expected rules to be a list of dicts, got "
                         f"{type(rules).__name__}")
    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size")

    # --- Setup text splitter ---
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "Clause", "Section", "."]
    )

    chunks = []
    for rule in rules:
        if not isinstance(rule, dict):
            raise ValueError(f"Expected each rule to be a dict, got {type(rule)}")

        text = str(rule.get("text", "")).strip()
        if not text:
            # Skip empty rule texts
            continue

        doc_id = rule.get("doc_id", "")
        sub_chunks = splitter.split_text(text)

        for i, ch in enumerate(sub_chunks):
            chunks.append({
                "doc_id": doc_id,
                "chunk_index": i,          # track position for traceability
                "text": ch,
                "metadata": {
                    k: v for k, v in rule.items() if k != "text"  # avoid duplicating large text
                }
            })

    return chunks
