import type { Task } from "./types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  disabled: boolean;
  onToggle: (task: Task) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskList({
  tasks,
  disabled,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">Nothing on your list yet. Add a task above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          disabled={disabled}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
