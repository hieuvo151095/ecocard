# Task Breakdown: School Administration Module Phase 3

> Feature ID: `029-school-administration-module-phase-3`  
> Plan: `plan.md`  

---

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

- [ ] `T011` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/feedback.ts`, `src/utils/feedbackValidation.ts`, `src/store/slices/feedbackSlice.ts`, `src/modules/school/feedback/`, `src/pages/[schoolCode]/school/feedback/`.
      Verification: `npm test tests/unit/feedback.test.mjs` verifying 4 status filter cards retaining independent global counts, 8 standard categories, 4 priority levels with inline editing, 2-way discussion threads with image attachments, and modal confirmation on ticket close (`Hoàn tất`). Docs: `docs/tasks.md`, `TASK-SCH-011`. Sync: Coordinate with Parent App team for mobile feedback ticket submission.
- [ ] `T012` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/calendar.ts`, `src/utils/calendarValidation.ts`, `src/store/slices/calendarSlice.ts`, `src/modules/school/calendar/`, `src/pages/[schoolCode]/school/calendar/`.
      Verification: `npm test tests/unit/calendar.test.mjs` validating 3-view calendar switching (`Năm`, `Tháng`, `Sự kiện`), 3 semantic category color bands, single-day event end-date auto-fill from start-date, tear-away calendar date cards in list mode, and modal deletion confirmations. Docs: `docs/tasks.md`, `TASK-SCH-012`. Sync: Align calendar holidays with Attendance module excused absence rules.
- [ ] `T013` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/academicYear.ts`, `src/utils/academicYearValidation.ts`, `src/store/slices/academicYearSlice.ts`, `src/modules/school/academicYear/`, `src/pages/[schoolCode]/school/academic-year/`.
      Verification: `npm test tests/unit/academicYears.test.mjs` verifying minimal 3-field creation/edit form, automated system-date current year badge calculation, date interval non-overlap validation between full school years, and client-side reactive search filtering. Docs: `docs/tasks.md`, `TASK-SCH-013`. Sync: Distribute active academic year state to cross-portal filter components.
- [ ] `T014` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/archive.ts`, `src/utils/archiveValidation.ts`, `src/store/slices/archiveSlice.ts`, `src/modules/school/archive/`, `src/pages/[schoolCode]/school/archive/`.
      Verification: `npm test tests/unit/archive.test.mjs` validating student archive listing with withdrawal audit context (date, operator, reason), alphabetical sorting, student detail inspection modal with yellow warning banner, restoration with class continuity check, and two-step permanent deletion confirmation. Docs: `docs/tasks.md`, `TASK-SCH-014`. Sync: Synchronize restored students with active class rosters in Student Directory (`/school/kid/`).
- [ ] `T015` [P] Owner: `ada-qa-agent` Write Scope: `tests/unit/feedback.test.mjs`, `tests/unit/calendar.test.mjs`, `tests/unit/academicYears.test.mjs`, `tests/unit/archive.test.mjs`.
      Verification: Execute full unit test suite `npm test`, verify clean production build `npm run build`, and confirm live HTTP 200 route responses. Docs: `docs/tasks.md`, `TASK-SCH-015`. Sync: Hand off verified Phase 3 modules for stakeholder design review.

## Parallel Groups

- Group A: `T011` (Feedback) and `T012` (Calendar) — Community communication and event scheduling.
- Group B: `T013` (Academic Years) and `T014` (Archived Students) — Institutional calendar configuration and student lifecycle archive governance.
- Group C: `T015` (QA & Quality Gates) — Platform regression testing and release packaging.

## Execution Monitoring

- Required pre-code gates: `validate_specs.py`, `run_required_docs_gates.py --mode execution`, development ledger initialization.
- Mid-slice checkpoints: `validate_doc_sync.py --strict` after each completed task.
- Circuit breaker after repeated failure: Stop and challenge architecture if any slice fails test verification 3 times sequentially.
- Human escalation trigger: Discrepancies between legacy specifications and current portal data contracts.

## Review Loop Tasks

- `R1`: Spec compliance review task: Verify implementation against `AC-034` to `AC-040`.
- `R2`: Code quality review task: Run `npx tsc --noEmit` and verify zero lint or type errors.
- `R3`: Verification readiness review task: Run full test suite `npm test` ensuring all tests pass.
- `R4`: Post-evidence reconcile task: Record live server HTTP 200 telemetry and sync documentation notes.

## Completion Checklist

- [x] `spec.md` accepted
- [x] `plan.md` accepted
- [x] `contracts/` complete or explicitly not applicable
- [x] `tasks.md` complete
- [x] `verification.md` contains evidence
- [x] Root `agents.md` updated
- [x] TrustGraph write attempted
