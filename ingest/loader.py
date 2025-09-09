import json
import pandas as pd
from pathlib import Path

def load_rules(file_path: str):
    """Load credit rules from JSON into list of dicts."""
    path = Path(file_path)
    if path.suffix == ".json":
        with open(path, "r", encoding="utf-8") as f:
            rules = json.load(f)
            if isinstance(rules, dict):
                # Convert dict-of-rules into list[dict]
                rules = [{"doc_id": k, **v} if isinstance(v, dict) else {"doc_id": k, "text": str(v)} for k, v in rules.items()]
            return rules
    
    else:
        raise ValueError(f"Unsupported rules file format: {path.suffix}")

def load_borrowers(file_path: str, as_dicts: bool = True):
    """Load borrower dataset (CSV)."""
    df = pd.read_csv(file_path)
    return df.to_dict(orient="records") if as_dicts else df

if __name__ == "__main__":
    rules = load_rules("data/interim/rules.json")
    borrowers = load_borrowers("data/interim/borrowers.csv")
    print(f"Loaded {len(rules)} rules and {len(borrowers)} borrowers")
