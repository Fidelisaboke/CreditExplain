import re

def normalize_text(text: str) -> str:
    """Clean & normalize text (basic PII removal, unify clause labels)."""
    if not isinstance(text, str):
        text = str(text)

    text = text.strip()
    text = re.sub(r"\s+", " ", text)  # collapse spaces

    # Normalize "Clause N"
    text = re.sub(r"(?i)clause\s+(\d+)", r"Clause \1", text)

    # Optional: remove common PII (emails, phone numbers)
    text = re.sub(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", "[EMAIL]", text)  # redact emails
    text = re.sub(r"\b\d{10,15}\b", "[PHONE]", text)  # redact phone numbers

    return text

def normalize_rules(rules, in_place: bool = True):
    """Normalize all rules' text."""
    if in_place:
        for r in rules:
            r["text"] = normalize_text(r.get("text", ""))
        return rules
    else:
        return [{**r, "text": normalize_text(r.get("text", ""))} for r in rules]
