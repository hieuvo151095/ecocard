# Task Breakdown: School Administration Module Phase 2

> Feature ID: `028-school-administration-module-phase-2`
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

- [ ] `T006` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/announcement.ts`, `src/utils/announcementValidation.ts`, `src/store/slices/announcementSlice.ts`, `src/modules/school/announcement/`, `src/pages/[schoolCode]/announcement/`.
      Verification: `npm test tests/unit/school-admin-phase2.test.mjs` verifying announcement life-cycle states (`ban_nhap`, `chua_gui`, `da_gui`), draft-only editing, preview modal rendering, and bulk deletion email permanence warnings. Docs: `docs/tasks.md`, `T-020-001-001`. Sync: Coordinate with Menu team for automated meal announcement integration.
- [ ] `T007` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/poll.ts`, `src/utils/pollValidation.ts`, `src/store/slices/pollSlice.ts`, `src/modules/school/poll/`, `src/pages/[schoolCode]/school/poll/`.
      Verification: `npm test tests/unit/school-admin-phase2.test.mjs` validating survey option rules ($\ge 2$), decoupled audience dispatch, conditional pie chart rendering ($\text{totalVotes} > 0$), and student revision history tracking. Docs: `docs/tasks.md`, `T-021-001-001`. Sync: Hand off survey responses to student profile hubs.
- [ ] `T008` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/menu.ts`, `src/utils/menuValidation.ts`, `src/store/slices/menuSlice.ts`, `src/modules/school/menu/`, `src/pages/[schoolCode]/school/menu/`.
      Verification: `npm test tests/unit/school-admin-phase2.test.mjs` verifying 8-week horizon limits, automatic class fallback to school-wide menu when no class override exists, GTIN/stamp traceability parsing, and asymmetric cloning (grid-only). Docs: `docs/tasks.md`, `T-022-001-001`. Sync: Broadcast menu notice creation to Bảng Thông Tin.
- [ ] `T009` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/staffAttendance.ts`, `src/utils/staffAttendanceValidation.ts`, `src/store/slices/staffAttendanceSlice.ts`, `src/modules/school/staffAttendance/`, `src/pages/[schoolCode]/school/staff-attendance/`.
      Verification: `npm test tests/unit/school-admin-phase2.test.mjs` validating single-click clock-in timestamps, mutual exclusivity between Check-in/out and Absent modals, 45-day retroactive date limit, and KPI summary counter suppression during search. Docs: `docs/tasks.md`, `T-023-001-001`. Sync: Verify staff IDs against Faculty Directory (`/school/teacher/`).
- [ ] `T010` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/handbook.ts`, `src/utils/handbookValidation.ts`, `src/store/slices/handbookSlice.ts`, `src/modules/school/handbook/`, `src/pages/[schoolCode]/school/handbook/`.
      Verification: `npm test tests/unit/school-admin-phase2.test.mjs` verifying strict 2-tier tree depth constraint, single-sibling accordion behavior, drag-and-drop sibling reordering, publishing toggles, and cascading category deletion guards. Docs: `docs/tasks.md`, `T-024-001-001`. Sync: Expose published articles to Parent Mobile App endpoints.

## Parallel Groups

- Group A: `T006` (Announcements) and `T007` (Polls) — Communication and surveying surfaces.
- Group B: `T008` (Meal Menus) and `T009` (Staff Attendance) — Daily operational and nutrition schedules.
- Group C: `T010` (Parent Handbook) — Institutional knowledge base.

## Execution Monitoring

- Required pre-code gates: `validate_specs.py`, `run_required_docs_gates.py --mode execution`, development ledger initialization.
- Mid-slice checkpoints: `validate_doc_sync.py --strict` after each completed task.
- Circuit breaker after repeated failure: Stop and challenge architecture if any slice fails test verification 3 times sequentially.
- Human escalation trigger: Discrepancies between legacy specifications and current portal data contracts.

## Review Loop Tasks

- `R1`: Spec compliance review task: Verify implementation against `AC-019` to `AC-028`.
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
