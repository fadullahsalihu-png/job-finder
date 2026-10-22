from uuid import uuid4

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator


class Task(BaseModel):
    id: str = Field(min_length=1)
    text: str = Field(min_length=1)
    completed: bool = False

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Task text cannot be blank")
        return normalized


class NewTask(BaseModel):
    text: str = Field(min_length=1)

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Task text cannot be blank")
        return normalized


class CompletionUpdate(BaseModel):
    completed: bool


app = FastAPI(title="Local Task List API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)

tasks: dict[str, Task] = {}


@app.get("/api/tasks", response_model=list[Task])
def list_tasks() -> list[Task]:
    return list(tasks.values())


@app.put("/api/tasks", response_model=list[Task])
def replace_tasks(saved_tasks: list[Task]) -> list[Task]:
    if len({task.id for task in saved_tasks}) != len(saved_tasks):
        raise HTTPException(status_code=422, detail="Task IDs must be unique")
    tasks.clear()
    tasks.update((task.id, task) for task in saved_tasks)
    return list(tasks.values())


@app.post("/api/tasks", response_model=Task, status_code=201)
def create_task(new_task: NewTask) -> Task:
    task = Task(id=str(uuid4()), text=new_task.text, completed=False)
    tasks[task.id] = task
    return task


@app.patch("/api/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, update: CompletionUpdate) -> Task:
    task = tasks.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    updated_task = task.model_copy(update={"completed": update.completed})
    tasks[task_id] = updated_task
    return updated_task


@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: str) -> Response:
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks[task_id]
    return Response(status_code=204)
