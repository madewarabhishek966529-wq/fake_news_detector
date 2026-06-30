from fastapi import APIRouter, Depends

from app.schemas import PredictionHistoryItem
from app.security import get_current_user
from app.database import predictions_collection

router = APIRouter(prefix="/api/history", tags=["History"])


@router.get("", response_model=list[PredictionHistoryItem])
async def get_history(current_user: dict = Depends(get_current_user)):
    cursor = predictions_collection.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).limit(100)

    items = []
    async for doc in cursor:
        items.append(
            PredictionHistoryItem(
                id=str(doc["_id"]),
                title=doc.get("title", ""),
                text_snippet=doc["text_snippet"],
                label=doc["label"],
                confidence=doc["confidence"],
                created_at=doc["created_at"],
            )
        )
    return items
