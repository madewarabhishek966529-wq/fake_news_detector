import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from mongomock_motor import AsyncMongoMockClient

import app.database as database_module
from app.main import app


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def mock_mongo():
    """Replace real MongoDB collections with an in-memory mock for tests."""
    mock_client = AsyncMongoMockClient()
    mock_db = mock_client["test_db"]

    database_module.client = mock_client
    database_module.database = mock_db
    database_module.users_collection = mock_db["users"]
    database_module.predictions_collection = mock_db["predictions"]

    import app.routers.auth_router as auth_router
    import app.routers.predict_router as predict_router
    import app.routers.history_router as history_router
    import app.security as security_module

    auth_router.users_collection = mock_db["users"]
    predict_router.predictions_collection = mock_db["predictions"]
    history_router.predictions_collection = mock_db["predictions"]
    security_module.users_collection = mock_db["users"]

    yield


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
