# Task Breakdown: School Administration Module Phase 1

> Feature ID: `027-school-administration-module-phase-1`
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

- [ ] `T001` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/student.ts`, `src/utils/studentValidation.ts`, `src/store/slices/studentSlice.ts`, `src/modules/school/student/`, `src/pages/[schoolCode]/school/kid/`.
      Verification: `npm test tests/unit/students.test.mjs` verifying directory listing, notes modal, 360° detail hub tabs, physical growth BMI arithmetic, individual class transfers, and bulk academic year promotions. Docs: `docs/tasks.md`, `T-015-001-001`. Sync: Inform Attendance, Invoicing, and Activity engineers upon student profile store stabilization.
- [ ] `T002` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/teacher.ts`, `src/utils/teacherValidation.ts`, `src/store/slices/teacherSlice.ts`, `src/modules/school/teacher/`, `src/pages/[schoolCode]/school/teacher/`.
      Verification: `npm test tests/unit/teachers.test.mjs` verifying faculty directory, substring search, homeroom/teaching separation, invitation submission, and two-tier content moderation pipeline. Docs: `docs/tasks.md`, `T-016-001-001`. Sync: Hand off moderation role flags to Activity and Schedule feature teams.
- [ ] `T003` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/class.ts`, `src/utils/classValidation.ts`, `src/store/slices/classSlice.ts`, `src/modules/school/class/`, `src/pages/[schoolCode]/school/class/`.
      Verification: `npm test tests/unit/classes.test.mjs` verifying curricular/extracurricular tabs, feature degeneration on extracurricular classes, and strict zero-student deletion safety invariant (`studentCount === 0`). Docs: `docs/tasks.md`, `T-017-001-001`. Sync: Broadcast class list updates to operational rosters and fee schedules.
- [ ] `T004` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/subject.ts`, `src/utils/subjectValidation.ts`, `src/store/slices/subjectSlice.ts`, `src/modules/school/subject/`, `src/pages/[schoolCode]/school/subject/`.
      Verification: `npm test tests/unit/subjects.test.mjs` verifying 4 educational tier tabs, read-only 4-term evaluation matrices, deduplicated teacher allocation modal, and faculty removal. Docs: `docs/tasks.md`, `T-018-001-001`. Sync: Sync subject identifiers with Gradebook and Timetable modules.
- [ ] `T005` [P] Owner: `benny-frontend-engineer` Write Scope: `src/types/grade.ts`, `src/utils/gradeValidation.ts`, `src/store/slices/gradeSlice.ts`, `src/modules/school/grades/`, `src/pages/[schoolCode]/school/grades/`.
      Verification: `npm test tests/unit/grades.test.mjs` verifying 4 educational tier listing, aggregate metric cards (classes and students per grade), and reactive client-side search resolution with instant restoration on clear. Docs: `docs/tasks.md`, `T-019-001-001`. Sync: Validate grade level IDs against class registration forms.


## Parallel Groups

- Group A: `T001` (Students), `T002` (Teachers), `T003` (Classes) - Core master records with disjoint slice architectures.
- Group B: `T004` (Subjects), `T005` (Grades) - Curriculum catalog and academic hierarchy.

## Execution Monitoring

- Required pre-code gates: `validate_specs.py`, `run_required_docs_gates.py --mode execution`, development ledger initialization.
- Mid-slice checkpoints: `validate_doc_sync.py --strict` after each completed task.
- Circuit breaker after repeated failure: Stop and challenge architecture if any slice fails test verification 3 times sequentially.
- Human escalation trigger: Divergence between legacy master data schemas and current portal types.

## Review Loop Tasks

- `R1`: Spec compliance review task: Verify implementation against `AC-001` to `AC-018`.
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
