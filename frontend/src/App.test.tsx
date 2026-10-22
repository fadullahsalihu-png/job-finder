import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import type { Task } from "./types";

const api = vi.hoisted(() => ({
  replace: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("./api", () => ({ taskApi: api }));

const savedTask: Task = { id: "a1", text: "Read a book", completed: false };

describe("task list app", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
    api.replace.mockImplementation((tasks: Task[]) => Promise.resolve(tasks));
  });

  it("restores saved tasks, seeds the API, and persists task operations", async () => {
    window.localStorage.setItem(
      "local-task-list.tasks",
      JSON.stringify([savedTask]),
    );
    api.create.mockResolvedValue({ id: "b2", text: "Write tests", completed: false });
    api.update.mockResolvedValue({ ...savedTask, completed: true });
    api.delete.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<App />);

    expect(await screen.findByText("Read a book")).toBeInTheDocument();
    expect(api.replace).toHaveBeenCalledWith([savedTask]);

    const input = screen.getByLabelText("New task");
    await user.type(input, "Write tests");
    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect(await screen.findByText("Write tests")).toBeInTheDocument();
    await waitFor(() =>
      expect(window.localStorage.getItem("local-task-list.tasks")).toContain(
        "Write tests",
      ),
    );

    await user.click(screen.getByRole("checkbox", { name: "Read a book" }));
    await waitFor(() => expect(api.update).toHaveBeenCalledWith({
      ...savedTask,
      completed: true,
    }));
    await waitFor(() =>
      expect(window.localStorage.getItem("local-task-list.tasks")).toContain(
        '"completed":true',
      ),
    );

    await user.click(screen.getByRole("button", { name: "Delete Read a book" }));
    await waitFor(() => expect(api.delete).toHaveBeenCalledWith("a1"));
    await waitFor(() =>
      expect(window.localStorage.getItem("local-task-list.tasks")).not.toContain(
        "Read a book",
      ),
    );
  });

  it("shows API errors and preserves the saved list when adding fails", async () => {
    window.localStorage.setItem(
      "local-task-list.tasks",
      JSON.stringify([savedTask]),
    );
    api.create.mockRejectedValue(new Error("API unavailable"));
    const user = userEvent.setup();

    render(<App />);
    await screen.findByText("Read a book");
    const input = screen.getByLabelText("New task");
    await user.type(input, "New task");
    await user.click(screen.getByRole("button", { name: "Add task" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("API unavailable");
    expect(window.localStorage.getItem("local-task-list.tasks")).toBe(
      JSON.stringify([savedTask]),
    );
    expect(input).toHaveValue("New task");
  });

  it("reports invalid saved data without replacing it", async () => {
    const malformed = "{not json";
    window.localStorage.setItem("local-task-list.tasks", malformed);

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Saved tasks have an invalid format.",
    );
    expect(api.replace).not.toHaveBeenCalled();
    expect(window.localStorage.getItem("local-task-list.tasks")).toBe(malformed);
  });
});
