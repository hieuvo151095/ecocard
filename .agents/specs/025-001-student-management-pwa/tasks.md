# Task Breakdown: Student Management PWA (POC)

> Feature ID: `025-001-student-management-pwa`
> Plan: `plan.md`

## Task Rules

- `[P]` means parallel-safe with disjoint write scope.
- Every task needs one owner and one verification method.
- Do not mark a task complete until `verification.md` has evidence.
- Every task must name the documentation artifact it updates before or alongside code.
- Every implementation task must declare what would block or fail it.

## Superpowers V34 Task Discipline

- Implementation tasks must be bite-sized and include exact file paths.
- Behavior-changing tasks must name the RED-GREEN-REFACTOR path:
  1. write or identify the failing test,
  2. run it and record the expected failure,
  3. implement the minimal fix,
  4. run the passing verification.
- Bugfix tasks must record root cause evidence before any fix.
- Review tasks must run in this order: spec compliance, then code quality.
- If a task cannot satisfy TDD, record the explicit exception and accepted risk.

## Tasks

- [ ] `T001` Owner: `sophia-product-manager` Write Scope: `spec.md`. Verification: no unresolved clarification markers unless explicitly accepted. Docs: `spec.md`, `verification.md`. Sync: update spec ledger when requirements change.
- [ ] `T002` Owner: `david-systems-architect` Write Scope: `plan.md`, `data-model.md`, `contracts/`, `quickstart.md`. Verification: constitution gates pass and interface boundaries are documented. Docs: `plan.md`, `data-model.md`, `quickstart.md`. Sync: update traceability matrix.
- [ ] `T003` Owner: `benny-frontend-engineer` Write Scope: `index.css`, `index.html`. Verification: Zinc dark monochrome token audit and sans-serif font stack verification. Docs: `docs/knowledge.md`. Sync: update design tokens.
- [ ] `T004` Owner: `benny-frontend-engineer` Write Scope: `src/components/SimulatorFrame.js`. Verification: viewport width >=768px renders iPhone 16 Pro frame, width <768px bypasses frame. Docs: `docs/planning/screens.md`. Sync: update screen inventory.
- [ ] `T005` Owner: `david-systems-architect` Write Scope: `src/data/mockData.js`. Verification: mock data JSON structure passes schema validation for student info, attendance logs, and 2-semester grades. Docs: `data-model.md`. Sync: update data model definitions.
- [ ] `T006` Owner: `benny-frontend-engineer` Write Scope: `src/components/Navigation.js`, `src/pages/HomePage.js`. Verification: bottom tab bar clicks transition between screens cleanly. Docs: `docs/planning/flows.md`. Sync: update user flow diagrams.
- [ ] `T007` Owner: `benny-frontend-engineer` Write Scope: `src/pages/AttendancePage.js`. Verification: month filter selector (Tháng 9 to Tháng 5) updates attendance scorecards and calendar records. Docs: `docs/planning/screens.md`. Sync: update screen states.
- [ ] `T008` Owner: `benny-frontend-engineer` Write Scope: `src/pages/GradesPage.js`. Verification: switching tabs between `Học kỳ 1`, `Học kỳ 2`, and `Cả năm` updates subject cards and term GPA correctly. Docs: `docs/planning/screens.md`. Sync: update screen states.
- [ ] `T009` Owner: `devops-system-architect` Write Scope: `manifest.json`, `sw.js`. Verification: Chrome DevTools PWA Audit passes offline caching and standalone launcher checks. Docs: `quickstart.md`. Sync: update offline manifest.
- [ ] `T010` Owner: `ada-qa-agent` Write Scope: `verification.md`. Verification: automated Playwright browser test logs pass clean execution. Docs: `verification.md`. Sync: append evidence and residual risk log.

## Parallel Groups

- Group A: `T003` (`index.css`), `T005` (`src/data/mockData.js`), `T009` (`manifest.json`, `sw.js`)
- Group B: `T004` (`SimulatorFrame.js`), `T006` (`Navigation.js`), `T007` (`AttendancePage.js`), `T008` (`GradesPage.js`)

## Execution Monitoring

- Required pre-code gates: `spec.md` and `plan.md` validation passed without errors.
- Mid-slice checkpoints: Component rendering and tab navigation verified in browser.
- Circuit breaker after repeated failure: Halt and return to orchestrator after 3 consecutive failures.
- Human escalation trigger: Unresolvable CSS browser layout bugs on mobile devices.

## Review Loop Tasks

- `R1`: Spec compliance review task: Verify user stories US-001, US-002, US-003 are fully represented in code.
- `R2`: Code quality review task: Verify Zinc monochrome tokens and JS modular component structures.
- `R3`: Verification readiness review task: Confirm all acceptance criteria AC-001 through AC-004 are verified with empirical evidence.
- `R4`: Post-evidence reconcile task: Synchronize `verification.md` and root `agents.md`.

## Completion Checklist

- [ ] `spec.md` accepted
- [ ] `plan.md` accepted
- [ ] `contracts/` complete or explicitly not applicable
- [ ] `tasks.md` complete
- [ ] `verification.md` contains evidence
- [ ] Root `agents.md` updated
- [ ] TrustGraph write attempted
