from abc import ABC, abstractmethod
from typing import Tuple


class BaseFakeNewsClassifier(ABC):
    """Abstract interface so the underlying model (TF-IDF+LogReg, BERT, etc.)
    can be swapped without touching the API layer."""

    @abstractmethod
    def load(self) -> None:
        """Load model artifacts from disk into memory."""
        raise NotImplementedError

    @abstractmethod
    def predict(self, text: str) -> Tuple[str, float, list[str]]:
        """Return (label, confidence, explanation_tokens)."""
        raise NotImplementedError
