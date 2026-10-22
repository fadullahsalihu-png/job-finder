import { useEffect, useState } from "react";
import { taskApi } from "./api";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import type { Task } from "./types";

const STORAGE_KEY = "local-task-list.tasks";

function readSavedTasks(): Task[] {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === null) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch {
    throw new Error("Saved tasks have an invalid format.");
  }
  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      (task) =>
        typeof task?.id === "string" &&
        typeof task?.text === "string" &&
        typeof task?.completed === "boolean",
    )
  ) {
    throw new Error("Saved tasks have an invalid format.");
  }
  return parsed as Task[];
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        const savedTasks = readSavedTasks();
        await taskApi.replace(savedTasks);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTasks));
        if (active) setTasks(savedTasks);
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : "Could not load saved tasks.",
          );
        }
      } finally {
        if (active) setReady(true);
      }
    }
    void initialize();
    return () => {
      active = false;
    };
  }, []);

  function persist(nextTasks: Task[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    setTasks(nextTasks);
    setError("");
  }

  async function addTask(text: string): Promise<boolean> {
    try {
      const created = await taskApi.create(text);
      persist([...tasks, created]);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add task.");
      return false;
    }
  }

  async function toggleTask(updated: Task) {
    try {
      const saved = await taskApi.update(updated);
      persist(tasks.map((task) => (task.id === saved.id ? saved : task)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update task.");
    }
  }

  async function deleteTask(id: string) {
    try {
      await taskApi.delete(id);
      persist(tasks.filter((task) => task.id !== id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete task.");
    }
  }

  return (
    <main className="app-shell">
      <header>
        <p className="eyebrow">A little more focus</p>
        <h1>My tasks</h1>
        <p className="subtitle">Keep track of what matters today.</p>
      </header>
      <TaskForm disabled={!ready} onAdd={addTask} />
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {!ready && !error ? (
        <p className="loading-state" role="status">
          Loading your tasks...
        </p>
      ) : (
        <TaskList
          tasks={tasks}
          disabled={!ready}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      )}
      <footer>Stored in this browser</footer>
    </main>
  );
}
