import pytest
from unittest.mock import patch


@pytest.mark.asyncio
async def test_predict_requires_auth(client):
    response = await client.post("/api/predict", json={"text": "Some article text here."})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_predict_success(client):
    await client.post(
        "/api/auth/register",
        json={"name": "Tester", "email": "tester@example.com", "password": "password1"},
    )
    login_resp = await client.post(
        "/api/auth/login", json={"email": "tester@example.com", "password": "password1"}
    )
    token = login_resp.json()["access_token"]

    with patch("app.routers.predict_router.get_classifier") as mock_get_classifier:
        mock_classifier = mock_get_classifier.return_value
        mock_classifier.predict.return_value = ("REAL", 0.87, ["research", "university", "study"])

        response = await client.post(
            "/api/predict",
            json={"title": "Test Title", "text": "A long enough article text for testing purposes here."},
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["label"] == "REAL"
    assert body["confidence"] == 0.87
    assert "research" in body["explanation"]


@pytest.mark.asyncio
async def test_predict_validation_error(client):
    await client.post(
        "/api/auth/register",
        json={"name": "Tester2", "email": "tester2@example.com", "password": "password1"},
    )
    login_resp = await client.post(
        "/api/auth/login", json={"email": "tester2@example.com", "password": "password1"}
    )
    token = login_resp.json()["access_token"]

    response = await client.post(
        "/api/predict",
        json={"text": "short"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_history_empty(client):
    await client.post(
        "/api/auth/register",
        json={"name": "Hist", "email": "hist@example.com", "password": "password1"},
    )
    login_resp = await client.post(
        "/api/auth/login", json={"email": "hist@example.com", "password": "password1"}
    )
    token = login_resp.json()["access_token"]

    response = await client.get("/api/history", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == []
