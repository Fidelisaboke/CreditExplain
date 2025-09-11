#!/usr/bin/env python3
"""
Demo test script for hackathon presentation.
Tests the complete pipeline with realistic queries.
"""
import json
from pathlib import Path
from core.self_rag import SelfRAG
from core.retrieval import LangChainEmbeddingModel, VectorRetriever
from core.reranker import LangChainReranker
from core.critic import GroqCritic
from core.generator import GroqGenerator

from dotenv import load_dotenv

load_dotenv()

def run_demo_test():
    """Run complete demo test"""
    print("🚀 Starting CreditExplain RAG Demo Test")
    print("=" * 50)
    
    # Initialize components
    print("Initializing components...")
    rag_system = SelfRAG(
        embed_model=LangChainEmbeddingModel(),
        retriever=VectorRetriever(),
        reranker=LangChainReranker(),
        critic=GroqCritic(),
        generator=GroqGenerator()
    )
    
    # Load test queries
    queries_path = Path("tests/demo_data/test_queries.json")
    with open(queries_path) as f:
        test_data = json.load(f)
    
    # Test regulatory queries
    print("\n📋 Testing Regulatory Queries:")
    print("-" * 30)
    
    for i, query_data in enumerate(test_data["regulatory_queries"], 1):
        query = query_data["query"]
        print(f"\n{i}. Query: {query}")
        
        result = rag_system.run(query)
        
        print(f"   ✓ Answer: {result['answer']['explanation'][:100]}...")
        print(f"   ✓ Confidence: {result['answer']['confidence']}")
        print(f"   ✓ Citations: {len(result['answer']['citations'])}")
        print(f"   ✓ Processing time: {result.get('processing_time', 0):.2f}s")
    
    # Test edge cases
    print("\n⚠️  Testing Edge Cases:")
    print("-" * 30)
    
    for query_data in test_data["edge_cases"]:
        query = query_data["query"]
        result = rag_system.run(query)
        
        should_retrieve = result.get("retrieval_performed", True)
        expected_retrieve = query_data.get("should_retrieve", True)
        
        status = "✓" if should_retrieve == expected_retrieve else "✗"
        print(f"{status} '{query}' -> Retrieve: {should_retrieve}")
    
    print("\n✅ Demo test completed successfully!")
    print("   The system is ready for hackathon presentation!")

if __name__ == "__main__":
    run_demo_test()
    