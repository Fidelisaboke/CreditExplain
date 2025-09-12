"""
Wrapper for lazy initialization of SelfRAG.
"""

import threading
import logging
from core.self_rag import SelfRAG

_rag_instance = None
_rag_lock = threading.Lock()
_logger = logging.getLogger(__name__)

def get_self_rag():
    global _rag_instance
    if _rag_instance is None:
        with _rag_lock:
            if _rag_instance is None:
                _logger.info("Lazy-initializing SelfRAG...")
                _rag_instance = SelfRAG()
    return _rag_instance
