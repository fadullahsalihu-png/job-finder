# Deployment Readiness

## Status

The app is ready for local use: the security review reports no findings from the final checks, with the limitation that this was not a full source-level security audit. No hosted deployment or external service is part of the requested scope.

## Required accounts

None for local development or use. The app requires no login, API key, payment, cloud account, or external database.

## Remaining steps

1. Install Python dependencies from the repository root with `pip install -e ".[dev]"`.
2. Install frontend dependencies from `frontend/` with `npm install`.
3. Run the FastAPI service locally with `uvicorn backend.main:app --reload`.
4. Run the Vite development server from `frontend/` with `npm run dev`.
5. Open the local URL reported by Vite.

If hosted deployment is wanted later, choose a hosting provider and configure separate deployment/build/start instructions then; that work is outside this local-only deliverable. Re-run backend/frontend tests and the frontend dependency audit after future dependency or code changes.
