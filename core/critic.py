import os, json, time
import openai
from typing import List, Dict

CRITIC_RETRIEVE_PROMPT = """
You are a critic. INPUT:
- Query: {query}

Return JSON only:
{{"retrieve": true_or_false, "notes": "..."}}
If unsure, set retrieve = true.
"""

CRITIC_SCORE_PROMPT = """
You are a critic assessing evidence for a query.

INPUT:
- Query: {query}
- Candidate answer: {answer}
- Supporting passage: {passage}

Return JSON only:
{{"isrel": 0.0, "issup": 0.0, "isuse": 0.0, "notes": "..."}}
Scores 0.0-1.0. Do NOT reveal chain-of-thought.
"""

class OpenAICritic:
    def __init__(self, model_name="gpt-4o-mini"):
        self.model = model_name

    def decide_retrieve(self, query: str) -> Dict:
        prompt = CRITIC_RETRIEVE_PROMPT.format(query=query)
        resp = openai.ChatCompletion.create(model=self.model, messages=[{"role":"user","content":prompt}], temperature=0.0)
        try:
            return json.loads(resp.choices[0].message.content)
        except:
            return {"retrieve": True, "notes": "fallback"}

    def score_candidate(self, query: str, answer: str, passage_text: str) -> Dict:
        prompt = CRITIC_SCORE_PROMPT.format(query=query, answer=answer, passage=passage_text)
        resp = openai.ChatCompletion.create(model=self.model, messages=[{"role":"user","content":prompt}], temperature=0.0)
        try:
            return json.loads(resp.choices[0].message.content)
        except:
            return {"isrel": 0.5, "issup": 0.5, "isuse": 0.5, "notes":"fallback"}
