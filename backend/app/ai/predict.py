import os
import joblib
import numpy as np

from app.ai.base_classifier import BaseFakeNewsClassifier
from app.ai.preprocess import clean_text
from app.config import get_settings

settings = get_settings()


class TfidfLogisticClassifier(BaseFakeNewsClassifier):
    """Baseline classifier: TF-IDF features + Logistic Regression.
    Implements BaseFakeNewsClassifier so it can be swapped for a BERT-based
    implementation later without changing router code.
    """

    def __init__(self) -> None:
        self.model = None
        self.vectorizer = None

    def load(self) -> None:
        if not os.path.exists(settings.model_path) or not os.path.exists(settings.vectorizer_path):
            raise FileNotFoundError(
                "Model artifacts not found. Run `python -m app.ai.train` first."
            )
        self.model = joblib.load(settings.model_path)
        self.vectorizer = joblib.load(settings.vectorizer_path)

    def predict(self, text: str):
        if self.model is None or self.vectorizer is None:
            self.load()

        cleaned = clean_text(text)
        vec = self.vectorizer.transform([cleaned])
        proba = self.model.predict_proba(vec)[0]
        classes = self.model.classes_
        label_idx = int(np.argmax(proba))
        label = classes[label_idx]
        confidence = float(proba[label_idx])

        explanation = self._top_contributing_terms(vec, label)
        return label, round(confidence, 4), explanation

    def _top_contributing_terms(self, vec, predicted_label: str, top_n: int = 5) -> list[str]:
        """Return the top TF-IDF terms in this document that most influenced
        the prediction, based on the logistic regression coefficients."""
        feature_names = np.array(self.vectorizer.get_feature_names_out())
        classes = list(self.model.classes_)
        class_idx = classes.index(predicted_label) if len(classes) > 2 else 0
        coefs = self.model.coef_[0] if len(classes) == 2 else self.model.coef_[class_idx]

        nonzero_idx = vec.nonzero()[1]
        if len(nonzero_idx) == 0:
            return []

        contributions = vec[0, nonzero_idx].toarray().flatten() * coefs[nonzero_idx]
        if len(classes) == 2 and predicted_label == classes[0]:
            contributions = -contributions

        ranked = sorted(zip(nonzero_idx, contributions), key=lambda x: x[1], reverse=True)
        top_terms = [feature_names[idx] for idx, _ in ranked[:top_n] if _ > 0]
        return top_terms if top_terms else ["No strongly dominant terms detected"]


_classifier_instance: BaseFakeNewsClassifier | None = None


def get_classifier() -> BaseFakeNewsClassifier:
    """Singleton accessor so the model is loaded once per process."""
    global _classifier_instance
    if _classifier_instance is None:
        _classifier_instance = TfidfLogisticClassifier()
        _classifier_instance.load()
    return _classifier_instance
