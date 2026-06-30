from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = AsyncIOMotorClient(settings.mongo_uri)
database = client[settings.mongo_db_name]

users_collection = database["users"]
predictions_collection = database["predictions"]


async def init_indexes() -> None:
    """Create required indexes on startup."""
    await users_collection.create_index("email", unique=True)
    await predictions_collection.create_index("user_id")
