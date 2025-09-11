"""
Critic component for Self-RAG system.
Uses open-source models via Groq for retrieval decisions and answer scoring.
Implements LangChain runnables for better integration and reliability.
"""

import os
import json
import logging
from typing import Dict, Optional, List
from dataclasses import dataclass

from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableSerializable
from langchain_core.exceptions import OutputParserException

from core.prompts import CRITIC_RETRIEVE_PROMPT, CRITIC_SCORE_PROMPT

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class CriticConfig:
    """Configuration for the critic component."""
    model_name: str = "llama-3.3-70b-versatile"
    temperature: float = 0.0
    max_retries: int = 3
    timeout: int = 30
    fallback_retrieve: bool = True
    fallback_scores: Dict[str, float] = None

    def __post_init__(self):
        if self.fallback_scores is None:
            self.fallback_scores = {"isrel": 0.5, "issup": 0.5, "isuse": 0.5}

class GroqCritic:
    """Critic component using open-source models via Groq API."""
    
    def __init__(self, config: Optional[CriticConfig] = None):
        """
        Initialize the Groq-based critic.
        
        Args:
            config: Critic configuration parameters
        """
        self.config = config or CriticConfig()
        
        # Initialize Groq chat model
        self.llm = ChatGroq(
            model_name=self.config.model_name,
            temperature=self.config.temperature,
            max_retries=self.config.max_retries,
            timeout=self.config.timeout,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        
        # Create runnables with LangChain
        self.retrieve_chain = self._create_retrieve_chain()
        self.score_chain = self._create_score_chain()
        
        logger.info(f"GroqCritic initialized with model: {self.config.model_name}")

    def _create_retrieve_chain(self) -> RunnableSerializable:
        """Create LangChain runnable for retrieval decision."""
        prompt = ChatPromptTemplate.from_template(CRITIC_RETRIEVE_PROMPT)
        parser = JsonOutputParser()
        
        return prompt | self.llm | parser

    def _create_score_chain(self) -> RunnableSerializable:
        """Create LangChain runnable for answer scoring."""
        prompt = ChatPromptTemplate.from_template(CRITIC_SCORE_PROMPT)
        parser = JsonOutputParser()
        
        return prompt | self.llm | parser

    def decide_retrieve(self, query: str) -> Dict:
        """
        Decide whether retrieval is needed for the given query.
        
        Args:
            query: User's input query
            
        Returns:
            Dictionary with retrieval decision and notes
        """
        try:
            result = self.retrieve_chain.invoke({"query": query})
            
            # Validate result structure
            if not isinstance(result, dict):
                raise ValueError("Invalid response format")
                
            if "retrieve" not in result:
                result["retrieve"] = self.config.fallback_retrieve
                
            return result
            
        except (OutputParserException, ValueError, Exception) as e:
            logger.warning(f"Retrieval decision failed: {e}. Using fallback.")
            return {
                "retrieve": self.config.fallback_retrieve,
                "notes": f"Fallback due to error: {str(e)}"
            }

    def score_candidate(self, query: str, answer: str, passage_text: str) -> Dict:
        """
        Score a candidate answer against a source passage.
        
        Args:
            query: Original user query
            answer: Generated answer to evaluate
            passage_text: Source passage text for validation
            
        Returns:
            Dictionary with relevance, support, and usefulness scores
        """
        try:
            # Truncate long texts to avoid token limits
            truncated_answer = answer[:2000] if len(answer) > 2000 else answer
            truncated_passage = passage_text[:2000] if len(passage_text) > 2000 else passage_text
            
            result = self.score_chain.invoke({
                "query": query,
                "answer": truncated_answer,
                "passage": truncated_passage
            })
            
            # Validate and normalize scores
            validated_scores = self._validate_scores(result)
            return validated_scores
            
        except (OutputParserException, ValueError, Exception) as e:
            logger.warning(f"Scoring failed: {e}. Using fallback scores.")
            return {
                **self.config.fallback_scores,
                "notes": f"Fallback due to error: {str(e)}"
            }

    def _validate_scores(self, scores: Dict) -> Dict:
        """
        Validate and normalize critic scores.
        
        Args:
            scores: Raw scores from LLM
            
        Returns:
            Validated and normalized scores
        """
        validated = scores.copy()
        
        # Ensure all required keys are present
        for key in ["isrel", "issup", "isuse"]:
            if key not in validated:
                validated[key] = self.config.fallback_scores[key]
                logger.warning(f"Missing score key '{key}', using fallback: {validated[key]}")
        
        # Normalize scores to 0.0-1.0 range
        for key in ["isrel", "issup", "isuse"]:
            try:
                score = float(validated[key])
                validated[key] = max(0.0, min(1.0, score))  # Clamp to [0, 1]
            except (ValueError, TypeError):
                validated[key] = self.config.fallback_scores[key]
                logger.warning(f"Invalid score for '{key}', using fallback: {validated[key]}")
        
        # Ensure notes field exists
        if "notes" not in validated:
            validated["notes"] = ""
            
        return validated

    def batch_score_candidates(self, query: str, candidates: List[Dict]) -> List[Dict]:
        """
        Score multiple candidate answers in a batch.
        
        Args:
            query: Original user query
            candidates: List of candidate dictionaries with 'answer' and 'passage_text'
            
        Returns:
            List of scored candidates
        """
        scored_candidates = []
        
        for i, candidate in enumerate(candidates):
            try:
                scores = self.score_candidate(
                    query=query,
                    answer=candidate.get("answer", ""),
                    passage_text=candidate.get("passage_text", "")
                )
                
                scored_candidates.append({
                    **candidate,
                    "scores": scores,
                    "candidate_index": i
                })
                
            except Exception as e:
                logger.error(f"Failed to score candidate {i}: {e}")
                # Add fallback scores for failed candidates
                scored_candidates.append({
                    **candidate,
                    "scores": {**self.config.fallback_scores, "notes": f"Scoring failed: {e}"},
                    "candidate_index": i
                })
        
        return scored_candidates

# Alternative implementation using a local model via Ollama
class OllamaCritic:
    """Critic component using local models via Ollama."""
    
    def __init__(self, model_name: str = "llama3.1:8b", base_url: str = "http://localhost:11434"):
        """
        Initialize the Ollama-based critic for offline use.
        
        Args:
            model_name: Ollama model name
            base_url: Ollama server URL
        """
        try:            
            self.llm = ChatOllama(
                model=model_name,
                temperature=0.0,
                base_url=base_url
            )
            
            self.retrieve_chain = self._create_retrieve_chain()
            self.score_chain = self._create_score_chain()
            
            logger.info(f"OllamaCritic initialized with model: {model_name}")
            
        except ImportError:
            logger.error("langchain-ollama not installed. Please install with: pip install langchain-ollama")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize Ollama critic: {e}")
            raise

    def _create_retrieve_chain(self):
        """Create retrieval decision chain for Ollama."""        
        prompt = ChatPromptTemplate.from_template(CRITIC_RETRIEVE_PROMPT)
        parser = JsonOutputParser()
        
        return prompt | self.llm | parser

    def _create_score_chain(self):
        """Create scoring chain for Ollama."""        
        prompt = ChatPromptTemplate.from_template(CRITIC_SCORE_PROMPT)
        parser = JsonOutputParser()
        
        return prompt | self.llm | parser

    # Methods would be similar to GroqCritic but with Ollama-specific error handling
    decide_retrieve = GroqCritic.decide_retrieve
    score_candidate = GroqCritic.score_candidate

# Factory function for creating critics
def create_critic(critic_type: str = "groq", **kwargs):
    """
    Factory function to create critic instances.
    
    Args:
        critic_type: Type of critic to create ('groq' or 'ollama')
        **kwargs: Additional arguments for critic configuration
        
    Returns:
        Configured critic instance
    """
    if critic_type.lower() == "groq":
        config = CriticConfig(**kwargs)
        return GroqCritic(config)
    
    elif critic_type.lower() == "ollama":
        return OllamaCritic(**kwargs)
    
    else:
        raise ValueError(f"Unknown critic type: {critic_type}. Use 'groq' or 'ollama'.")
