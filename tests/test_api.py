from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def setup_function() -> None:
    client.put("/api/tasks", json=[])


def test_create_list_update_and_delete_task() -> None:
    created = client.post("/api/tasks", json={"text": "  Buy milk  "})
    assert created.status_code == 201
    task = created.json()
    assert task["text"] == "Buy milk"
    assert task["completed"] is False

    listed = client.get("/api/tasks")
    assert listed.json() == [task]

    updated = client.patch(
        f"/api/tasks/{task['id']}", json={"completed": True}
    )
    assert updated.status_code == 200
    assert updated.json()["completed"] is True

    deleted = client.delete(f"/api/tasks/{task['id']}")
    assert deleted.status_code == 204
    assert client.get("/api/tasks").json() == []


def test_rejects_blank_task_text() -> None:
    assert client.post("/api/tasks", json={"text": "   "}).status_code == 422


def test_missing_task_returns_not_found() -> None:
    assert client.patch(
        "/api/tasks/missing", json={"completed": True}
    ).status_code == 404
    assert client.delete("/api/tasks/missing").status_code == 404


def test_replace_tasks_preserves_ids_and_rejects_duplicate_ids() -> None:
    saved = [{"id": "saved-id", "text": "Saved task", "completed": True}]
    response = client.put("/api/tasks", json=saved)
    assert response.status_code == 200
    assert client.get("/api/tasks").json() == saved

    duplicate_ids = saved + [{"id": "saved-id", "text": "Duplicate"}]
    assert client.put("/api/tasks", json=duplicate_ids).status_code == 422
