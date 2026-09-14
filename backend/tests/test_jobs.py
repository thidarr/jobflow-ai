from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_home():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to JobFlow AI"
    }

def test_get_jobs():
    response = client.get("/jobs")

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_due_follow_ups():
    response = client.get("/jobs/follow-ups/due")

    assert response.status_code == 200
    data = response.json()

    assert "follow_up_dates" in data
    assert isinstance(data["follow_up_dates"], list)