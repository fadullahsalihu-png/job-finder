import type { Task } from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail =
      typeof body?.detail === "string" ? body.detail : response.statusText;
    throw new Error(detail || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export const taskApi = {
  list: () => request<Task[]>("/api/tasks"),
  replace: (tasks: Task[]) =>
    request<Task[]>("/api/tasks", {
      method: "PUT",
      body: JSON.stringify(tasks),
    }),
  create: (text: string) =>
    request<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  update: (task: Task) =>
    request<Task>(`/api/tasks/${encodeURIComponent(task.id)}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: task.completed }),
    }),
  delete: (id: string) =>
    request<void>(`/api/tasks/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
