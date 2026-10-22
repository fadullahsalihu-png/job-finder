# Plan: Local Task List App

## Scope

Build a small task-list application with a FastAPI backend and a React frontend. It must support adding tasks, marking tasks complete or incomplete, and deleting tasks. Keep data and dependencies local to the app: use browser `localStorage` for persistence, do not add a remote database or third-party service, and make the frontend communicate with the local FastAPI API.

## Requirements

- Provide a FastAPI service with a small, typed API for listing, adding, updating completion state, and deleting tasks.
- Provide a React UI that displays tasks and exposes add, complete/incomplete, and delete actions.
- Persist the task list in browser `localStorage` so it survives page reloads without external storage.
- Keep the backend local and lightweight; it must not require accounts, API keys, hosted services, or a database.
- Include clear local development instructions and tests for the core API and user-visible behavior where the repository's setup allows.
- Follow the repository's existing conventions, and avoid unrelated changes.

## Acceptance criteria

1. A user can add a non-empty task and see it in the list.
2. A user can toggle a task between incomplete and complete, with the UI reflecting the state.
3. A user can delete a task and it disappears from the list.
4. Saved tasks and completion states are restored after a browser reload from `localStorage`.
5. The React frontend uses the local FastAPI service for task operations; no remote service or persistent server database is required.
6. The API rejects invalid task input with an appropriate client error and returns sensible responses for missing task IDs.
7. The app can be run locally using documented commands, and relevant automated tests pass.
8. No secrets or credentials are introduced.

## Out of scope

- User accounts, authentication, multi-user synchronization, hosted deployment, and remote persistence.
- Advanced task features such as due dates, tags, filtering, or drag-and-drop ordering.
