# Feature Tasks: School Operating Portal

> Feature ID: `026-project-planning-school-operating-portal`  
> Status: Planning Complete  
> Governance: Marcus Fleet Constitution V1.0.0

---

## Superpowers V34 Task Discipline

- Strict RED-GREEN-REFACTOR execution cycle: Author failing test first, implement minimal code to pass, and refactor cleanly.
- Enforce spec compliance before code style or subjective optimizations.
- Zero completion claims without concrete, reproducible verification evidence.

## Foundation & Setup Tasks

- [ ] `T001`: Initialize Next.js Pages Router foundation with multi-tenant dynamic routing `pages/[schoolCode]/...`, NextAuth.js session configuration, and centralized Redux Toolkit store.
  - Owner: `alan-tech-lead`
  - Write Scope: `src/pages/`, `src/store/`, `src/lib/auth.ts`
  - Verification: Automated Jest test verifying dynamic tenant route extraction from URL path.
  - Docs: `docs/knowledge.md`
  - Sync: Inform backend and UI engineers upon store structure completion.

- [ ] `T002`: Configure ECO Design System 1.0 styling foundation with Tailwind CSS configuration, `styled-components` registry, and Google Fonts typography imports.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/styles/`, `tailwind.config.js`, `src/components/theme/`
  - Verification: Snapshot test asserting `#FEC020` brand yellow and `#0070CE` primary blue token availability.
  - Docs: `docs/knowledge.md`
  - Sync: Notify team that atomic design primitives are ready for consumption.

- [ ] `T003`: Implement Laravel Sanctum API client wrapper with tenant header injection `X-School-Code` and bearer token refresh interceptor.
  - Owner: `david-systems-architect`
  - Write Scope: `src/services/api/`, `src/lib/http.ts`
  - Verification: Unit test verifying automatic header injection and 401 redirect handling.
  - Docs: `docs/decisions.md`
  - Sync: Distribute typed API contract clients to frontend feature leads.

---

## Module 1: Vận Hành (Operations) Tasks

- [ ] `T004`: Build daily per-class attendance roster screen (`/class/[classId]/attendance`) with single-click arrival (Đón) and departure (Trả) actions and counter updates.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/operations/attendance/`
  - Verification: Cypress test verifying arrival click increments presence counter and calculates late badges.
  - Docs: `docs/prd.md`
  - Sync: Hand off attendance events for meal deduction integration.

- [ ] `T005`: Implement checkout time validation enforcing departure greater than arrival (MSG01) and gear-button authorized pickup guardian modal.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/operations/attendance/components/`
  - Verification: Unit test asserting validation rejection when departure is earlier than arrival.
  - Docs: `docs/planning/flows.md`
  - Sync: Validate guardian roster dropdown with student profile data.

- [ ] `T006`: Build bulk absence modal with Excused (Có phép) vs Unexcused (Không phép) radio choices, tuition refund eligibility toggle, and internal notes.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/operations/attendance/modals/`
  - Verification: Test verifying multi-student selection and payload dispatch to bulk absence endpoint.
  - Docs: `docs/planning/screens.md`
  - Sync: Ensure absence refund flag updates student billing ledger.

- [ ] `T007`: Build daily activities social feed (`/class/[classId]/activity`) supporting rich text, media upload, hashtag `#` lesson picker, user `@` mentions, and post status queue.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/operations/activity/`
  - Verification: Component test verifying post publishing and status pill rendering (Chờ duyệt / Đã duyệt).
  - Docs: `docs/prd.md`
  - Sync: Link uploaded activity media to the automated class album.

- [ ] `T008`: Build media library album viewer (`/class/[classId]/media`) with automated "Hoạt động" and "Điểm danh" system albums and facial recognition tagging gallery.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/operations/media/`
  - Verification: Playwright test asserting photo rendering, face tag bounding boxes, and student name hover popups.
  - Docs: `docs/planning/screens.md`
  - Sync: Connect background face recognition worker status events.

- [ ] `T009`: Build parent messaging communication center (`/conversations/group`) supporting direct parent threads, student group channels, and class broadcast messaging.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/operations/messaging/`
  - Verification: WebSocket integration test validating outbound message dispatch and incoming message thread appending.
  - Docs: `docs/planning/flows.md`
  - Sync: Confirm notification dispatch to parent mobile endpoints.

---

## Module 2: Học Tập (Academics) Tasks

- [ ] `T010`: Build weekly class timetable builder and schedule viewer (`/school/schedule`) with period matrix, subject assignment, and parent dispatch audit log.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/academics/schedule/`
  - Verification: UI test verifying grid period slot assignment and publication audit history modal.
  - Docs: `docs/planning/screens.md`
  - Sync: Export schedule data for attendance subject cross-referencing.

- [ ] `T011`: Build homework management module (`/school/assignment`) with class/subject assignment creation, attachment uploads, deadline pickers, and student submission tracking.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/academics/assignment/`
  - Verification: Component test verifying homework creation and submission status list rendering.
  - Docs: `docs/prd.md`
  - Sync: Notify parent communication channel upon new homework dispatch.

- [ ] `T012`: Build gradebook and evaluation matrix (`/school/scoreboard`) filterable by grade level, class, and subject, supporting regular, midterm, and final grades.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/academics/scoreboard/`
  - Verification: Table test checking inline score editing, numerical validation (0.0 - 10.0), and average computation.
  - Docs: `docs/planning/screens.md`
  - Sync: Publish verified semester grades to student academic records.

---

## Module 3: Tài Chính (Finance) Tasks

- [ ] `T013`: Build student tuition billing roster (`/school/fee`) with invoice creation wizard, VietQR payment code generation, and payment status lifecycle management.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/finance/fee/`
  - Verification: Unit and UI test verifying invoice line item computation, tax calculations, and status pill rendering.
  - Docs: `docs/prd.md`
  - Sync: Register webhook endpoints with banking gateway emulator.

- [ ] `T014`: Implement automated attendance-linked meal deduction logic during invoice generation, pulling excused absence counts from Module 1.
  - Owner: `alan-tech-lead`
  - Write Scope: `src/modules/finance/fee/services/`
  - Verification: Integration test asserting invoice generation for a student with 3 excused absences deducts 3 * meal_daily_rate from the billing total.
  - Docs: `docs/knowledge.md`
  - Sync: Verify refund calculation accuracy with school accounting leads.

- [ ] `T015`: Build fee catalog management (`/school/school-fees`) and per-class tuition fee schedule assignment (`/school/tuition-management`).
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/finance/catalog/`
  - Verification: CRUD tests for fee items and class schedule mapping matrices.
  - Docs: `docs/planning/screens.md`
  - Sync: Expose active fee structures to invoice calculation engine.

- [ ] `T016`: Build expense disbursement voucher tracker (`/school/expenses`) with category classification, receipt attachments, approval workflow, and voucher cancellation flows.
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/finance/expenses/`
  - Verification: Test verifying expense voucher submission and status change to "Đã hủy" upon authorized cancellation.
  - Docs: `docs/prd.md`
  - Sync: Link disbursement records to monthly accounting balance reports.

- [ ] `T017`: Build payment session reconciliation (`/school/reconciliation`) and tuition collection analytics dashboard (`/reports/fee/overview`).
  - Owner: `benny-frontend-engineer`
  - Write Scope: `src/modules/finance/reconciliation/`
  - Verification: Test reconciling sample bank transaction batch against invoice ledger and chart rendering of collection rates.
  - Docs: `docs/planning/screens.md`
  - Sync: Provide audit export reports for executive review.

---

## Review Loop Tasks

- [ ] `T018`: Execute R01 Product and Scope Review validating all implemented sub-modules against legacy specs.
  - Owner: `sophia-product-manager`
  - Write Scope: `tests/reviews/r01-product-review.md`
  - Verification: Complete checklist verification against `docs_legacy/operating-portal/`.
  - Docs: `docs/prd.md`
  - Sync: Report findings to engineering lead.

- [ ] `T019`: Execute R02 Architecture and Security Review verifying multi-tenant isolation and session encryption.
  - Owner: `cipher-security-approver`
  - Write Scope: `tests/reviews/r02-security-review.md`
  - Verification: Security audit scanning for tenant header leakages or XSS vulnerabilities.
  - Docs: `docs/decisions.md`
  - Sync: Approve release gate for staging deployment.

- [ ] `T020`: Execute R03 QA and E2E Verification Review running complete automated Playwright test suite.
  - Owner: `ada-qa-agent`
  - Write Scope: `tests/reviews/r03-qa-review.md`
  - Verification: Headless Playwright test run passing 100% across all user scenarios.
  - Docs: `docs/tasks.md`
  - Sync: Issue formal release recommendation to operator.

---

## Parallel Groups

- **Group A (Independent UI Slices):** Tasks `T002`, `T007`, `T008`, `T010`, `T011`, `T015` can be developed in parallel as their write scopes do not overlap.
- **Group B (Core Business Services):** Tasks `T004`, `T005`, `T006` must precede `T014` to provide verified attendance absence records for billing meal deduction calculations.

---

## Execution Monitoring

- Daily build and test status monitored via local automated test runners and CI pipelines.
- Sentry and Playwright test logs reviewed after each feature slice completion.
- No task marked complete without concrete, replayable verification evidence recorded in `verification.md`.
