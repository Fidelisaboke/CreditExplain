GENERATOR_PROMPT = """
You are an expert compliance analyst.

INPUT:
- Query: {query}
- Supporting passages (each with id): 
{passages_block}
passages_block += f"[{pid} | {p['metadata'].get('doc_type')}] {txt}\n\n"


TASK:
Return a short, evidence-backed explanation (max 6 sentences) answering the query. For every factual claim include an inline citation in the form [doc_id:chunk_id]. At the end include a line "confidence: HIGH|MEDIUM|LOW".
Return JSON ONLY in this exact format:
{{"explanation":"...","citations":[{{"doc_id":"...","chunk_id":"...","text_excerpt":"..."}}],"confidence":"HIGH"}}
Do NOT include chain-of-thought or private notes.
"""

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
