# Product Specification: Local Task List

## Product

A minimal task-list application with a React frontend and a local FastAPI backend. The app supports creating, completing or reopening, and deleting tasks. Browser `localStorage` is the durable source of task data; the local API supports task operations without a remote database or service.

## User stories

- As a user, I can add a task so I can keep track of something I need to do.
- As a user, I can mark a task complete or reopen it so its status stays current.
- As a user, I can delete a task I no longer need.
- As a user, I can reload the page and retain my tasks and their completion states.

## Functional requirements

- Tasks have a stable ID, non-empty text, and a completion state.
- The interface lists tasks and provides an input/button to add one.
- Each task can be toggled complete/incomplete and deleted.
- Task mutations use the local FastAPI API.
- The frontend persists task data in browser `localStorage` and restores it on reload.
- Invalid task input and unknown task IDs produce appropriate API errors.

## Constraints

- No hosted services, remote database, or account/API-key setup.
- The app runs locally and documents its development and test commands.
- Keep the implementation focused on the required task-list operations.
