# Agent roles

Run the roles in order. Each role reads only the preceding role's artifact and
writes only its own artifact. Planner takes the user request as its brief.
Artifacts belong in `artifacts/`.

1. **Planner** — Read the user request. Define scope, requirements, and
   acceptance criteria in `artifacts/plan.md`.
2. **Architect** — Read only `artifacts/plan.md`. Choose a simple design and
   document components, interfaces, and test strategy in
   `artifacts/architecture.md`.
3. **Coder** — Read only `artifacts/architecture.md`. Implement that design
   and record changed files and implementation notes in
   `artifacts/implementation.md`.
4. **Tester** — Read only `artifacts/implementation.md`. Run the described
   checks, make and verify fixes as needed, and write results in
   `artifacts/test-report.md`.
5. **Security Reviewer** — Read only `artifacts/test-report.md`. Review the
   described implementation and checks for security concerns, then write
   findings (or explicitly state none found) in
   `artifacts/security-review.md`.
6. **Deployer** — Read only `artifacts/security-review.md`. Document
   deployment readiness, required accounts, and remaining steps in
   `artifacts/deployer.md`.

## Hard rules

- Never commit to `main`; make changes on a feature branch.
- If a fix fails three times in a row, stop and explain the failure.
- Never put secrets in source code, artifacts, logs, or chat. Do not print or
  store credentials.
- Ask the user before any action requiring their login, an API key, or payment.
- Do not advance to the next role until the current role's artifact is written.
- Do not have a role read files written by any other role or unrelated project
  files. A role may run a check without inspecting its inputs beyond its
  permitted artifact.
