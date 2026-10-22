import type { Task } from "./types";

interface TaskItemProps {
  task: Task;
  disabled: boolean;
  onToggle: (task: Task) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskItem({
  task,
  disabled,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <li className={`task-item${task.completed ? " is-complete" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          disabled={disabled}
          onChange={() => void onToggle({ ...task, completed: !task.completed })}
        />
        <span>{task.text}</span>
      </label>
      <button
        className="delete-button"
        type="button"
        disabled={disabled}
        aria-label={`Delete ${task.text}`}
        onClick={() => void onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  );
}
