import pytest


@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post(
        "/api/auth/register",
        json={"name": "Jane Doe", "email": "jane@example.com", "password": "secret123"},
    )
    assert response.status_code == 201
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    payload = {"name": "Jane", "email": "dup@example.com", "password": "secret123"}
    await client.post("/api/auth/register", json=payload)
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_login_success(client):
    payload = {"name": "John", "email": "john@example.com", "password": "mypassword"}
    await client.post("/api/auth/register", json=payload)

    response = await client.post(
        "/api/auth/login", json={"email": "john@example.com", "password": "mypassword"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    payload = {"name": "John", "email": "wrongpw@example.com", "password": "mypassword"}
    await client.post("/api/auth/register", json=payload)

    response = await client.post(
        "/api/auth/login", json={"email": "wrongpw@example.com", "password": "bad"}
    )
    assert response.status_code == 401
