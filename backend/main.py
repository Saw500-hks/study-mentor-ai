import sys
import os

# Add parent directory to sys.path so app imports resolve correctly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

__all__ = ["app"]