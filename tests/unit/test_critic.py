"""Test critic component"""

import pytest
from core.critic import GroqCritic, CriticConfig

from dotenv import load_dotenv

load_dotenv()


def test_critic_retrieval_decision():
    """Test critic makes sane retrieval decisions"""
    critic = GroqCritic(CriticConfig(model_name="llama-3.3-70b-versatile"))

    # Should retrieve - specific regulatory question
    decision1 = critic.decide_retrieve("What are Basel III capital requirements?")
    assert decision1["retrieve"] == True

    # Should not retrieve - general question
    decision2 = critic.decide_retrieve("Hello, how are you?")
    assert decision2["retrieve"] == False
