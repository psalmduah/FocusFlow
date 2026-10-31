from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "broken"


def test_version_endpoint():
    response = client.get("/version")

    assert response.status_code == 200
    assert response.json()["application"] == "FocusFlow"