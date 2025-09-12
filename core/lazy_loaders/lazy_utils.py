import threading
import psutil, os
import logging

_logger = logging.getLogger(__name__)

def log_memory(prefix: str = ""):
    process = psutil.Process(os.getpid())
    rss_mb = process.memory_info().rss / (1024 * 1024)
    _logger.info(f"{prefix} Memory usage: {rss_mb:.2f} MB")

def singleton(cls):
    """
    Decorator to make a class follow singleton + lazy init with thread safety.
    """
    instances = {}
    lock = threading.Lock()

    def get_instance(*args, **kwargs):
        if cls not in instances:
            with lock:
                if cls not in instances:
                    _logger.info(f"Creating singleton instance for {cls.__name__}")
                    instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance
