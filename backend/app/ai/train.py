"""
Standalone training script for the baseline TF-IDF + Logistic Regression
fake-news classifier.

Usage:
    python -m app.ai.train --data data/sample_train.csv

Expects a CSV with columns: text, label  (label values: "FAKE" / "REAL")
"""

import argparse
import os
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

from app.ai.preprocess import clean_text


def load_dataset(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=["text", "label"])
    df["text"] = df["text"].astype(str)
    df["label"] = df["label"].str.upper().str.strip()
    return df


def train_and_evaluate(csv_path: str, model_dir: str) -> dict:
    df = load_dataset(csv_path)
    df["clean_text"] = df["text"].apply(clean_text)

    X_train, X_test, y_train, y_test = train_test_split(
        df["clean_text"], df["label"], test_size=0.2, random_state=42, stratify=df["label"]
    )

    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), min_df=1)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    model = LogisticRegression(max_iter=1000, C=1.0, class_weight="balanced")
    model.fit(X_train_vec, y_train)

    y_pred = model.predict(X_test_vec)

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, pos_label="FAKE", zero_division=0),
        "recall": recall_score(y_test, y_pred, pos_label="FAKE", zero_division=0),
        "f1": f1_score(y_test, y_pred, pos_label="FAKE", zero_division=0),
    }

    print("Evaluation metrics:", metrics)
    print(classification_report(y_test, y_pred, zero_division=0))

    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, "model.joblib"))
    joblib.dump(vectorizer, os.path.join(model_dir, "vectorizer.joblib"))
    print(f"Model and vectorizer saved to {model_dir}")

    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/sample_train.csv")
    parser.add_argument("--out", default="app/ai/artifacts")
    args = parser.parse_args()
    train_and_evaluate(args.data, args.out)
