# Test Report

## Results after security remediation

| Check | Result |
| --- | --- |
| `pytest` | **Passed:** 4 tests. One upstream Starlette deprecation warning about using `httpx` with `starlette.testclient`. |
| `cd frontend && npm test` | **Passed:** 3 tests in 1 test file. |
| `cd frontend && npm run build` | **Passed:** TypeScript project build and Vite production bundle completed. |
| `cd frontend && npm audit` | **Passed:** 0 vulnerabilities reported. |

The frontend toolchain was upgraded to Vite 7.3.7, `@vitejs/plugin-react` 5.2.0, and Vitest 5.0.5 after the initial audit identified vulnerable Vite 5.x, Vitest 2.1.x, and related transitive dependencies. The updated lockfile was audited and reports no vulnerabilities.

## Earlier test iterations

The first frontend test run revealed missing test cleanup between tests and ambiguous checkbox selection; the test setup and selector were corrected. It also exposed malformed local storage JSON surfacing a raw parse error; startup now reports invalid saved data consistently without replacing it. The first build found Vite type incompatibility from Vite 6 and the installed Vitest 2 dependency tree; Vite was aligned to the compatible 5.x line before the subsequent security upgrade. All checks passed after fixes and again after the final toolchain upgrade.

## Setup notes

- Installed backend development dependencies with `pip install -e ".[dev]"`.
- Installed frontend dependencies with `cd frontend && npm install`; this created `frontend/package-lock.json`.
- Frontend commands must be run from `frontend/`.
