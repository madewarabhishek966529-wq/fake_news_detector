import re
import string

_URL_RE = re.compile(r"https?://\S+|www\.\S+")
_NON_ALPHA_RE = re.compile(r"[^a-zA-Z\s]")
_MULTI_SPACE_RE = re.compile(r"\s+")

STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "if", "is", "are", "was", "were",
    "be", "been", "being", "to", "of", "in", "on", "at", "for", "with",
    "by", "from", "as", "this", "that", "these", "those", "it", "its",
    "he", "she", "they", "we", "you", "i", "his", "her", "their", "our",
    "your", "my", "not", "no", "do", "does", "did", "have", "has", "had",
}


def clean_text(text: str) -> str:
    """Normalize raw article text for TF-IDF vectorization."""
    text = text.lower()
    text = _URL_RE.sub(" ", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = _NON_ALPHA_RE.sub(" ", text)
    text = _MULTI_SPACE_RE.sub(" ", text).strip()
    tokens = [t for t in text.split() if t not in STOPWORDS and len(t) > 2]
    return " ".join(tokens)
