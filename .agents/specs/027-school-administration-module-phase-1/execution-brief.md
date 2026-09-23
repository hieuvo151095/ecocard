# Execution Brief: Feature Specification: School Administration Module Phase 1

> Feature ID: `027-school-administration-module-phase-1`
> Task Shape: `frontend-behavior`
> Generated From: `spec.md`, `plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, `agent-routing.md`

## 1. Operator Intent Snapshot

## 1. Purpose

The School Administration Module ("Nhà Trường") establishes the institutional master data backbone for the entire School Operating Portal. It manages the core entity relationships across Students (Học Sinh), Teachers (Giáo Viên), Classes (Lớp Học), Subjects (Môn Học), and Grade Levels (Khối Lớp). 

This Phase 1 slice delivers the foundational operational data hub:
1. **Học Sinh:** Student records, 360° profile hub with multi-parent contact cards, per-student tuition overrides, physical health records with BMI tracking, individual class transfers, and bulk academic year grade transitions ("Chuyển năm học").
2. **Giáo Viên:** Faculty directory, homeroom vs teaching assignments, account invitation dispatch, and a two-tier content moderation pipeline ("Giáo viên chính" auto-publishes vs "Giáo viên hỗ trợ" queued for approval).
3. **Lớp Học:** Dual class taxonomy separating regular curricular classes ("Lớp chính khóa") from extracurricular classes ("Lớp ngoại khóa") with purposeful feature degeneration, homeroom teacher allocation, and strict zero-student deletion safeguards.
4. **Môn Học:** Subject curriculum catalog organized across 4 educational levels (TH, THCS, THPT, GDTX) and academic years, read-only term evaluation rubrics, and deduplicated administrative teacher assignments.
5. **Khối Lớp:** Grade level hierarchy oversight across the 4 educational tiers with aggregate headcount analytics and reactive client-side search resolution.


## 2. Required Behavior

## 3. Functional Requirements

- `FR-001`: The system MUST provide a student directory (`/school/kid/`) filterable by academic year, class, keyword search, enrollment date, and CSDL Sở flag.
- `FR-002`: The system MUST provide a 360° student detail hub (`/school/kid/detail/[id]/`) with 5 primary tabs: "Hồ Sơ" (identity, parents, tuition overrides, height/weight BMI history), "Hoạt Động", "Thư Viện", "Điểm Danh", and "Học Phí".
- `FR-003`: The system MUST provide student creation (`/school/kid/create/`) validating mandatory fields (Mã học sinh, Họ và tên, Số CCCD) with optional tuition override and baseline physical growth metrics.
- `FR-004`: The system MUST support individual class transfer and bulk academic year transfer ("Chuyển năm học") enforcing 3 cascades: fee schedule update, parent chat room revocation, and evaluation record pruning.
- `FR-005`: The system MUST provide a student notes modal allowing internal administrative notes, showing a visual indicator (📄) on the directory roster when populated.
- `FR-006`: The system MUST provide a teacher directory (`/school/teacher/`) filterable by class (matching both homeroom and assigned teaching classes), keyword substring search across name and email, and CSDL Sở flag.
- `FR-007`: The system MUST enforce two-tier teacher content moderation permissions: "Giáo viên chính" (activities publish automatically) vs "Giáo viên hỗ trợ" (activities submit to administrative moderation queue).
- `FR-008`: The system MUST provide teacher invitation onboarding ("Tạo và gửi lời mời"), credential updates via a dedicated "Thay đổi email" modal, and password resets delegating to account configuration.
- `FR-009`: The system MUST provide a class management catalog (`/school/class/`) organized into two distinct tabs: "Lớp chính khóa" (curricular) and "Lớp ngoại khóa" (extracurricular).
- `FR-010`: The system MUST enforce degraded feature support for extracurricular classes: extracurricular classes support only attendance, daily activities, and media albums, while strictly omitting tuition billing schedules, gradebook evaluation matrices, and subject teacher assignments.
- `FR-011`: The system MUST enforce that the delete action for classes is strictly permitted only when student enrollment equals zero (`studentCount === 0`). Classes with 1 or more enrolled students MUST hide or disable the delete action.
- `FR-012`: The system MUST provide homeroom teacher (GVCN) assignment for regular classes and direct multi-select teacher allocation for extracurricular classes.
- `FR-013`: The system MUST maintain a subject catalog (`/school/subject/`) structured across 4 educational levels (TH, THCS, THPT, GDTX) and academic years, displaying read-only syllabus evaluation schemes across 4 evaluation terms.
- `FR-014`: The system MUST allow school administrators to assign and remove teaching teachers for any subject, automatically deduplicating already-assigned teachers from the assignment modal dropdown.
- `FR-015`: The system MUST provide a grade level hierarchy (`/school/grades/`) organized across 4 educational levels with aggregate metrics (Mã khối, Cấp học, Số học sinh, Số lớp), and provide reactive client-side search resolution that instantly restores full listings on clearing input.


## 5. Acceptance Criteria

- `AC-001`: Student Directory table displays student photo avatar, full name, student code, homeroom class (with optional "Ngoại khóa: {name}" subline), study status pill, gender, creator, and standardized `•••` action dropdown (`Xem chi tiết`, `Cập nhật`, `Lưu trữ`, `Chuyển lớp`, `Xóa`).
- `AC-002`: An icon indicator (📄) appears next to the student's name only when internal notes exist; clicking it opens the notes modal displaying current content and edit capabilities.
- `AC-003`: Student Detail Hub (`/school/kid/detail/[id]/`) renders 5 tabs: "Hồ Sơ" (master identity, expandable parent contact cards with multi-student linking, tuition fee overrides, and physical height/weight growth history with automated BMI calculation) plus 4 filtered context tabs ("Hoạt Động", "Thư Viện", "Điểm Danh", "Học Phí").
- `AC-004`: Class transfer and academic year promotion ("Chuyển năm học") modals enforce selecting old and new classes, explicitly prompting acknowledgement of the 3 transition rules (fee schedule cascade, chat revocation, evaluation pruning).
- `AC-005`: Teacher Directory table displays staff name, homeroom class, assigned teaching classes, contact info (phone, email), address, and `•••` action dropdown.
- `AC-006`: Teacher detail view distinguishes "Lớp chủ nhiệm" from "Lớp phụ trách" and displays "Phân quyền" (Giáo viên chính vs Giáo viên hỗ trợ) with an informative tooltip explaining moderation behavior.
- `AC-007`: Email updates are managed through a dedicated "Thay đổi email" modal, and password resets delegate directly to account configuration (`/setting/users/{id}/change-password/`).
- `AC-008`: Adding a new teacher submits via "Tạo và gửi lời mời" which validates Email, Temporary Password, and Full Name.
- `AC-009`: Class Overview manages classes under two tabs: "Lớp chính khóa" (curricular) and "Lớp ngoại khóa" (extracurricular), toggleable via form switch.
- `AC-010`: Extracurricular classes enforce degraded feature scope: omitting tuition fee configurations, gradebook evaluation rubrics, and subject allocations, while supporting attendance, activities, and photo albums.
- `AC-011`: The delete action (`Xóa`) is strictly visible and permitted only for classes with 0 enrolled students. For any class with 1 or more students, the delete option is completely omitted from the action menu.
- `AC-012`: Regular class detail embeds "Thông tin học phí" (6 standard line items) and "Phân công bộ môn" requiring an assigned grade level.
- `AC-013`: Subject catalog organizes subjects across 4 educational level tabs (TH, THCS, THPT, GDTX) with distinct subject IDs and academic year context.
- `AC-014`: Detail view presents read-only syllabus evaluation matrix across 4 terms (Giữa HK1, HK1, Giữa HK2, Cuối năm) specifying Point, Evaluation Level, and Comment rubrics.
- `AC-015`: Administrative staff can add teachers to subjects via a modal dropdown that automatically deduplicates already-assigned faculty, and remove teachers with a confirmation pop-up.
- `AC-016`: Grade level catalog displays the 4-tier educational hierarchy (TH, THCS, THPT, GDTX) with 4 summary metric cards (Mã khối, Cấp học, Số học sinh, Số lớp).
- `AC-017`: Grade detail lists all assigned classes with homeroom teacher links, student counts, and teacher totals.
- `AC-018`: Search filtering executes reactively on the client side, overcoming legacy server-side search defects, and immediately restores the complete listing upon clearing the search term without requiring page reloads.


## 3. Scope Boundaries

## 7. Constraints

- Framework: Next.js (Pages Router) with dynamic routing `pages/[schoolCode]/school/...`
- State Management: Redux Toolkit slice architecture (`studentSlice.ts`, `teacherSlice.ts`, `classSlice.ts`, `subjectSlice.ts`, `gradeSlice.ts`)
- Styling: Mixed Tailwind CSS for layout + `styled-components` for encapsulated UI primitives.
- Design System: ECO Design System 1.0 (Yellow `#FEC020`, Blue `#0070CE`, Vietnamese typography).
- Interaction Standards: Universal logic change confirmation pop-ups, top-right global toast notifications (`addToast`), Sentence case headers, and `•••` action dropdowns.
- Out of scope: The remaining 9 sub-modules of Nhà Trường (Bảng Thông Tin, Bình Chọn, Thực Đơn, Điểm Danh NV, Sổ Tay PH, Góp Ý, Lịch Sự Kiện, Năm Học, Lưu Trữ) will be planned in Phase 2.


## 4. Active Work Slice

## 1. Technical Summary

The School Administration Module ("Nhà Trường") provides core institutional master data across five initial sub-modules:
1. **Học Sinh (`/school/kid/`):** Student directory, 360° profile hub with multi-parent cards, tuition fee overrides, physical development BMI history, class transfers, and bulk academic year promotions.
2. **Giáo Viên (`/school/teacher/`):** Faculty directory, homeroom and subject class assignments, invitation credential dispatch, and a two-tier content moderation pipeline ("Giáo viên chính" vs "Giáo viên hỗ trợ").
3. **Lớp Học (`/school/class/`):** Dual class taxonomy (Curricular vs Extracurricular) with intentional feature degeneration for extracurricular classes, homeroom teacher allocation, and zero-student deletion safety guards.
4. **Môn Học (`/school/subject/`):** Four-tier educational subject catalog (TH, THCS, THPT, GDTX) with 4-term evaluation matrices and deduplicated faculty assignments.
5. **Khối Lớp (`/school/grades/`):** Grade level hierarchy across 4 tiers with aggregate headcounts and client-side reactive search resolution.

The implementation builds on Next.js Pages Router with Redux Toolkit slices (`studentSlice.ts`, `teacherSlice.ts`, `classSlice.ts`, `subjectSlice.ts`, `gradeSlice.ts`), TypeScript contracts, mock datasets, and business validation engines.


## 6. Agent Routing

| Workstream | Primary Agent | Output | Verification |
| --- | --- | --- | --- |
| Student Hub (`TASK-SCH-001`) | `benny-frontend-engineer` | `studentSlice`, Student Directory, 360° Profile Hub | Automated unit tests (`tests/unit/students.test.mjs`) |
| Teacher Directory (`TASK-SCH-002`) | `benny-frontend-engineer` | `teacherSlice`, Teacher Directory, Invitation Flow | Automated unit tests (`tests/unit/teachers.test.mjs`) |
| Class Management (`TASK-SCH-003`) | `benny-frontend-engineer` | `classSlice`, Class Catalog, Deletion Safeguard | Automated unit tests (`tests/unit/classes.test.mjs`) |
| Subject Catalog (`TASK-SCH-004`) | `benny-frontend-engineer` | `subjectSlice`, Subject Matrix, Teacher Assignment | Automated unit tests (`tests/unit/subjects.test.mjs`) |
| Grade Levels (`TASK-SCH-005`) | `benny-frontend-engineer` | `gradeSlice`, Grade Hierarchy, Reactive Search | Automated unit tests (`tests/unit/grades.test.mjs`) |
| QA & Regression | `ada-qa-agent` | Test suites, clean build, live HTTP 200 telemetry | `npm test` & `npm run build` |


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


## 4.1 Dynamic Execution Signals

### Changed Files

- No changed files were provided for this brief rebuild.

### Failing Evidence

- No failing evidence was provided for this brief rebuild.

## Execution Monitoring

- Required pre-code gates: `validate_specs.py`, `run_required_docs_gates.py --mode execution`, development ledger initialization.
- Mid-slice checkpoints: `validate_doc_sync.py --strict` after each completed task.
- Circuit breaker after repeated failure: Stop and challenge architecture if any slice fails test verification 3 times sequentially.
- Human escalation trigger: Divergence between legacy master data schemas and current portal types.


## 5. Development Ledger Context

Read these development-ledger notes before source edits for the active slice:

No `docs/development/` notes matched this feature workspace.
Before behavior-changing code work, create or reconcile the development ledger for this feature slice.
Preferred paths:
- If the feature is new: run `python3 .agents/scripts/create_development_docs.py --name "<epic-or-feature-name>" --feature-id "<feature-id>" --epic-number 001 --child-number 001 --task-number 001`.
- If the project is brownfield or docs are stale: route to `/doc_reconcile` and repair the ledger before source edits.

## 6. Verification Path

## Verification Plan

### Evidence-before-claim Protocol
- NO COMPLETION CLAIMS are permitted without fresh, replayable verification execution evidence.
- Verification must directly validate acceptance criteria and test vectors.

| Requirement | Method | Command or Procedure | Expected Result |
| --- | --- | --- | --- |
| `FR-001` - `FR-005` (Students) | Automated Unit Tests | `npm test tests/unit/students.test.mjs` | 100% tests pass; covers directory, notes, profile hub, BMI, transfers |
| `FR-006` - `FR-008` (Teachers) | Automated Unit Tests | `npm test tests/unit/teachers.test.mjs` | 100% tests pass; covers directory, search, moderation tiers, invitation |
| `FR-009` - `FR-012` (Classes) | Automated Unit Tests | `npm test tests/unit/classes.test.mjs` | 100% tests pass; covers taxonomy, feature degeneration, deletion invariant |
| `FR-013` - `FR-014` (Subjects) | Automated Unit Tests | `npm test tests/unit/subjects.test.mjs` | 100% tests pass; covers 4 tiers, term matrix, teacher allocation |
| `FR-015` (Grades) | Automated Unit Tests | `npm test tests/unit/grades.test.mjs` | 100% tests pass; covers 4 tiers, aggregate counts, reactive search |
| Full System Integrity | Automated Suite | `npm test` | All unit test suites pass with 0 failures |
| TypeScript Types | Compilation Check | `npx tsc --noEmit` | Clean compilation with 0 errors |
| HTTP Telemetry | Curl Server Endpoints | `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/kid http://localhost:3000/demo/school/teacher http://localhost:3000/demo/school/class http://localhost:3000/demo/school/subject http://localhost:3000/demo/school/grades` | Returns HTTP 200 for all 5 sub-module routes |


## Execution Gates

- Pre-implementation gates passed: Specification approved, architecture decisions recorded, data models mapped.
- Plan/contract readiness confirmed: Contracts designed in `src/types/` without circular dependencies.
- Documentation targets created or reconciled: PRD, tasks, knowledge, decisions, flows, screens, diagrams updated.
- Required human approvals: Operator authorization of planning specifications.


## Local Preconditions

- Required services: Next.js dev server on port 3000 (`npm run dev`).
- Required environment variables: Default local tenant context `schoolCode=demo`.
- Required commands: Node.js 18+ and Python 3.10+.


## Validation Path

1. Run automated unit test suites:
   ```bash
   npm test
   ```
2. Confirm clean compilation:
   ```bash
   npx tsc --noEmit
   ```
3. Verify live HTTP endpoints:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/kid
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/teacher
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/class
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/subject
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/grades
   ```


## POC Rehearsal

- Smallest end-to-end path:
  1. Open `/school/kid/` and verify student roster, notes modal, and 360° detail hub tabs.
  2. Open `/school/teacher/` and verify faculty list, substring search, and moderation tier badge.
  3. Open `/school/class/` and verify curricular/extracurricular tabs, and deletion restriction on classes with students.
  4. Open `/school/subject/` and verify 4 educational tier tabs, read-only evaluation rubrics, and faculty assignment.
  5. Open `/school/grades/` and verify aggregate cards, class rosters, and reactive instant search.


## 7. Review and Release Signals

## 10. Review Loop

- `R01`: Product & Scope Alignment Review — Verified all 5 sub-modules (Học Sinh, Giáo Viên, Lớp Học, Môn Học, Khối Lớp) against legacy specifications and PRD acceptance criteria AC-024 to AC-028 with zero scope creep.
- `R02`: Architecture & Guardrail Integrity Review — Validated class deletion invariant (`studentCount === 0`), extracurricular feature degeneration, two-tier teacher moderation pipeline, and tripartite student transition cascades.
- `R03`: Quality & Verification Gate Review — Confirmed complete test suite specifications, reactive search fix validation, and live HTTP 200 telemetry coverage.


## Review Loop Tasks

- `R1`: Spec compliance review task: Verify implementation against `AC-001` to `AC-018`.
- `R2`: Code quality review task: Run `npx tsc --noEmit` and verify zero lint or type errors.
- `R3`: Verification readiness review task: Run full test suite `npm test` ensuring all tests pass.
- `R4`: Post-evidence reconcile task: Record live server HTTP 200 telemetry and sync documentation notes.


## Review Rounds

| Round | Reviewer | Finding Summary | Required Changes | Disposition |
| --- | --- | --- | --- | --- |
| `R1` | `sophia-product-manager` | PRD requirements match all 5 sub-modules from legacy specifications. | None | Approved |
| `R2` | `alan-tech-lead` | Architecture decouples master data cleanly while maintaining cross-module tab reuse. | None | Approved |
| `R3` | `ada-qa-agent` | Verification commands established covering all business rules and invariants. | None | Approved |


## Release Recommendation

- Recommendation: `GO`
- Basis for recommendation: Complete specification, verified research ledgers, resolved legacy ambiguities, and strict adherence to Marcus Fleet V34 planning discipline.
- Required follow-up before wider rollout: Execute implementation slices under `/develop` once authorized by operator.


## 7.1 Superpowers Discipline Snapshot

- clarification status: read `spec.md#6. Clarifications` before planning or widening scope.
- TDD or accepted exception: behavior-changing tasks must name RED-GREEN-REFACTOR or an explicit accepted exception.
- Root cause status for bugfix work: reproduce and identify cause before mutation.
- Review order: spec compliance before code quality.
- Completion claim gate: fresh verification required before success language.

## 8. Context Expansion Rules

### Task Shape Decision

- Selected task shape: `frontend-behavior`
- Why this shape: Read page, feature, hook, and browser-interaction artifacts first.

### Required Reads

- Required read: `agents.md`
- Required read: `.agents/memory/constitution.md`
- Required read: `.agents/specs/027-school-administration-module-phase-1/execution-brief.md`
- Required read: `.agents/specs/027-school-administration-module-phase-1/spec.md` only if the brief or failing evidence says deeper requirement context is needed.
- Required read: `.agents/specs/027-school-administration-module-phase-1/plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, and `agent-routing.md` only when the current write scope or failing evidence requires the deeper artifact.
- Required read: create or reconcile the missing `docs/development/` notes before behavior-changing source edits.

### Forbidden Default Reads

- Forbidden by default: schema and migration files
- Forbidden by default: analytics stacks
- Forbidden by default: cloud orchestration
- Forbidden by default: unrelated persistence layers

### Expansion Triggers

- Read page, feature, hook, and browser-interaction artifacts first.
- Do not widen into data-contract or infrastructure context without failing evidence.
- Load frontend, technical lead, and QA skills unless the spec explicitly says otherwise.
- Read the `docs/development/` notes listed in this brief before widening beyond the current work slice.
- If the required epic/feature/module/page/task note is missing, stop and reconcile the development ledger instead of improvising from code alone.

## Review Topology

| Review Stage | Primary Reviewer | Input Artifact | Output Artifact |
| --- | --- | --- | --- |
| Spec challenge | `aurora-plan-challenger` | `spec.md` | updated `spec.md` and findings |
| Plan challenge | `alan-tech-lead` | `plan.md` | updated `plan.md` and architecture notes |
| Verification sign-off | `ada-qa-agent` | `verification.md` | evidence-backed recommendation |


## Escalation Rules

- Escalate when documentation prerequisites are missing or misleading.
- Escalate when verification fails repeatedly without new evidence.
- Escalate when write scope conflicts with another agent's ownership.
