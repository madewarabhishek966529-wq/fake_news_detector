from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.schemas import ArticleInput, PredictionOut
from app.security import get_current_user
from app.database import predictions_collection
from app.ai.predict import get_classifier, TfidfLogisticClassifier

router = APIRouter(prefix="/api/predict", tags=["Prediction"])


@router.post("", response_model=PredictionOut)
async def predict_article(payload: ArticleInput, current_user: dict = Depends(get_current_user)):
    try:
        classifier: TfidfLogisticClassifier = get_classifier()
        label, confidence, explanation = classifier.predict(payload.text)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    snippet = payload.text[:200] + ("..." if len(payload.text) > 200 else "")
    doc = {
        "user_id": str(current_user["_id"]),
        "title": payload.title,
        "text_snippet": snippet,
        "label": label,
        "confidence": confidence,
        "explanation": explanation,
        "created_at": datetime.now(timezone.utc),
    }
    result = await predictions_collection.insert_one(doc)

    return PredictionOut(
        id=str(result.inserted_id),
        title=doc["title"],
        text_snippet=doc["text_snippet"],
        label=doc["label"],
        confidence=doc["confidence"],
        explanation=doc["explanation"],
        created_at=doc["created_at"],
    )
