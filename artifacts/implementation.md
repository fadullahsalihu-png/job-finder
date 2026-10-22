# Implementation Notes

## Changed files

- `README.md`: local Python/Node setup and test/build commands.
- `pyproject.toml`: FastAPI runtime and test dependency configuration.
- `backend/main.py`: in-memory task API for listing, replacing, creating, completing/reopening, and deleting tasks, including input validation and missing-ID responses.
- `tests/test_api.py`: backend API coverage for core operations, invalid input, unknown IDs, and saved-list replacement.
- `frontend/package.json`, `frontend/index.html`, `frontend/tsconfig*.json`, `frontend/vite.config.ts`, and `frontend/vitest.config.ts`: React/Vite/TypeScript app and test setup; Vite proxies `/api` to local FastAPI.
- `frontend/src/App.tsx`, `frontend/src/api.ts`, `frontend/src/types.ts`, and UI component/style files: task UI, API client, browser `localStorage` restore/persistence, error display, and responsive styling.
- `frontend/src/App.test.tsx` and `frontend/src/test-setup.ts`: UI behavior tests including saved task initialization, add/toggle/delete persistence, API failure handling, and malformed saved data.

## Implementation behavior

- The frontend restores and validates browser-saved task data, then seeds the in-memory API with those records on startup.
- Task mutations update local storage and the displayed list only after API success. Failed adds retain the input; failures are presented as an alert.
- The API trims task descriptions, rejects blank descriptions and duplicate restored IDs, and returns 404 for unknown task IDs.
- No remote persistence, login, external API, or credentials are used.
- After the security review identified vulnerable development-tooling versions, upgraded the frontend toolchain to `vite` 7.3.7, `@vitejs/plugin-react` 5.2.0, and `vitest` 5.0.5. The updated dependency lockfile has no `npm audit` findings.

## Tester handoff

Run backend checks from the repository root with `pytest`.
Run frontend checks from `frontend/` with `npm test`, followed by `npm run build`.
Run `cd frontend && npm audit` to check the frontend dependency tree.
The package setup is new, so install declared dependencies first if they are not already available:

```bash
pip install -e ".[dev]"
cd frontend && npm install
```

Record actual command outcomes, including dependency/network limitations, in `artifacts/test-report.md`. Do not claim unrun checks passed.
