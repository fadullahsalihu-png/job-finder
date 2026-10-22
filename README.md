# Local Task List

A small task-list app with a React frontend and FastAPI backend. Tasks are saved
in the browser's `localStorage`; the API keeps an in-memory working copy and
does not require a database, account, or external service.

## Requirements

- Python 3.10+
- Node.js 18+ and npm

## Run locally

In one terminal, start the API from the repository root:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn backend.main:app --reload
```

In another terminal, install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173). Vite
proxies `/api` requests to FastAPI at http://localhost:8000.

## Tests

Run backend tests from the repository root:

```bash
pytest
```

Run frontend tests and a production build:

```bash
cd frontend
npm test
npm run build
```