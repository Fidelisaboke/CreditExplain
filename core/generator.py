import os, time, json
from typing import List, Dict
from prompts import GENERATOR_PROMPT

# Example OpenAI wrapper; you can swap to a HF generator if offline.
import openai

class Generator:
    def __init__(self, model_name: str = "gpt-4o-mini"):
        self.model_name = model_name
        self.api_key = os.getenv("OPENAI_API_KEY")

    def generate_from_passages(self, query: str, passages: List[Dict]) -> Dict:
        passages_block = ""
        for p in passages:
            pid = p['id']
            txt = p['doc_text'][:800]  # cap
            passages_block += f"[{pid}] {txt}\n\n"
        prompt = GENERATOR_PROMPT.format(query=query, passages_block=passages_block)
        # Call OpenAI ChatCompletion (example)
        resp = openai.ChatCompletion.create(
            model=self.model_name,
            messages=[{"role":"user", "content": prompt}],
            temperature=0.0,
            max_tokens=512
        )
        content = resp.choices[0].message.content.strip()
        # parse JSON
        try:
            data = json.loads(content)
        except Exception as e:
            # fallback: return raw string in explanation field
            data = {"explanation": content, "citations": [], "confidence": "LOW"}
        data['model_version'] = self.model_name
        return data
