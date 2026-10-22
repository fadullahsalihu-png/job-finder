import { useState, type FormEvent } from "react";

interface TaskFormProps {
  disabled: boolean;
  onAdd: (text: string) => Promise<boolean>;
}

export function TaskForm({ disabled, onAdd }: TaskFormProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      if (await onAdd(trimmed)) setText("");
    } catch {
      // The parent reports the API error; keep the user's input intact.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="new-task">
        New task
      </label>
      <input
        id="new-task"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
        maxLength={500}
        disabled={disabled || submitting}
      />
      <button type="submit" disabled={disabled || submitting || !text.trim()}>
        Add task
      </button>
    </form>
  );
}
