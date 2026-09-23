# Feature Specification: Project Planning - School Operating Portal

> Feature ID: `026-project-planning-school-operating-portal`  
> Created: `2026-09-12`  
> Status: Planning Complete  
> Source Prompt: Rebuild priority modules: Vận Hành (Operations), Học Tập (Academics), and Tài Chính (Finance) for School Operating Portal using Next.js, Redux, Tailwind+styled-components, Laravel Sanctum API, Google Cloud Run, OpenResty, and Multi-tenant architecture.

---

## 1. Purpose

The School Operating Portal replaces fragmented and sluggish legacy administration tools with a unified, cloud-native multi-tenant platform designed for Vietnamese K-12 and pre-K institutions. The primary outcome is providing school leadership, teachers, and accountants with an integrated interface that achieves sub-second check-in roster response times, automates cross-module attendance-to-billing meal fee reconciliations, and simplifies daily academic tracking.

---

## 2. User Stories

- [x] `US-001`: As a homeroom teacher, I need to record daily morning arrival and afternoon departure times with one click per student, so that student presence is immediately recorded and visible to administration and parents.
- [x] `US-002`: As a duty teacher, I need to verify authorized pickup guardians when checking a student out, so that children are only released to approved family members.
- [x] `US-003`: As an academic administrator, I need to configure weekly period timetables and publish them to parents with full versioning history, so that class scheduling is transparent.
- [x] `US-004`: As a school accountant, I need to generate monthly tuition billing statements that automatically deduct meal credits for verified excused absence days, so that manual refund calculation errors are eradicated.
- [x] `US-005`: As an internal operator, I need strict multi-tenant data isolation and role-based access control, so that execution remains secure, auditable, and governable across all school tenants.

---

## 3. Functional Requirements

- `FR-001`: The system MUST provide a daily class attendance roster filterable by class and date, supporting single-click check-in (Đón) and checkout (Trả) with timestamp tracking and automatic late-arrival labeling.
- `FR-002`: The system MUST validate that check-out time is strictly greater than check-in time, rejecting invalid entries with error message `Giờ trả học sinh phải lớn hơn giờ đón học sinh`.
- `FR-003`: The system MUST provide an authorized pickup modal accessible via the checkout gear button, allowing teachers to record the specific guardian taking the student home.
- `FR-004`: The system MUST support bulk absence designation requiring selection of Excused (Có phép) vs Unexcused (Không phép) and refund eligibility flags.
- `FR-005`: The system MUST support daily activity posts with rich text, media attachments, lesson tags (`#`), user mentions (`@`), and approval status queues (Chờ duyệt / Đã duyệt).
- `FR-006`: The system MUST provide media albums that automatically aggregate photos from activities and attendance, integrated with an asynchronous AI facial recognition pipeline for student tagging.
- `FR-007`: The system MUST provide real-time and asynchronous messaging channels for direct parent communication, student groups, and class announcements.
- `FR-008`: The system MUST support weekly class timetables structured by morning and afternoon periods with schedule publication versioning.
- `FR-009`: The system MUST support homework assignment distribution with due dates, instruction attachments, and student submission tracking.
- `FR-010`: The system MUST provide a gradebook matrix supporting configurable regular, midterm, and semester examination grading rubrics.
- `FR-011`: The system MUST generate monthly tuition invoices with dynamic VietQR payment strings and itemized fee breakdowns.
- `FR-012`: The system MUST automatically calculate meal fee deductions based on verified excused absence days recorded in attendance.
- `FR-013`: The system MUST maintain fee catalogs and per-class fee schedule assignments with pricing overrides.
- `FR-014`: The system MUST provide an expense voucher workflow with category classification, receipt attachments, and cancellation audit logs.
- `FR-015`: The system MUST provide a payment reconciliation tool that audits transaction sessions and gateway settlement batches against student invoice ledgers.

---

## 4. Non-Functional Requirements

- `NFR-001`: Performance: Daily attendance roster initial load time MUST be less than 800ms under 95th percentile load, with optimistic client updates reflecting in under 100ms.
- `NFR-002`: Security: Authentication MUST enforce NextAuth.js encrypted JWE session cookies and Laravel Sanctum bearer tokens with tenant header `X-School-Code`.
- `NFR-003`: Observability: System exceptions and API errors MUST be monitored via Sentry (~10% trace sampling), paired with Google Analytics 4 and Microsoft Clarity.
- `NFR-004`: Maintainability: Codebase MUST enforce Next.js Pages Router with Redux Toolkit, Tailwind CSS layout geometry, and `styled-components` atomic UI tokens.
- `NFR-005`: Documentation and traceability: Every core feature MUST trace back to grounded specifications in `docs_legacy/operating-portal/`.

---

## 5. Acceptance Criteria

- `AC-001`: Given a homeroom teacher on the attendance screen, when clicking "Đón", then the arrival timestamp is saved and the attendance counter increments immediately.
- `AC-002`: Given a student with arrival at 08:00, when attempting to set checkout at 07:55, then the system rejects the submission with error toast `Giờ trả học sinh phải lớn hơn giờ đón học sinh`.
- `AC-003`: Given an unmarked student, when clicking quick checkout, then the system displays inline message `Chưa nhập thời gian đón học sinh` and blocks saving.
- `AC-004`: Given multiple absent students, when clicking "Vắng" on the toolbar, then the bulk absence modal enforces choosing Có phép/Không phép and refund status.
- `AC-005`: Given an accountant running invoice generation, then the billing total reflects automatic deductions for verified excused absences from the prior month.
- `AC-006`: Given an uploaded photo album, then the background facial recognition worker detects enrolled student faces and populates tag badges without freezing UI requests.

---

## 6. Clarifications

### Question Back Protocol

Before planning, ask back when any answer can change scope, user behavior, security posture, data ownership, rollback, verification, or cost. Each question must name the decision it protects.

### Clarification Ledger

| Question | Why It Matters | Answer or Accepted Risk | Status |
|---|---|---|---|
| Should facial recognition execute synchronously or asynchronously? | Prevents Cloud Run gateway timeouts on large photo batches. | Asynchronous Cloud Run task with UI progress indicator. | Resolved |
| How are attendance absence refunds processed? | Direct cash vs invoice credit line. | Default to automated credit line deduction on next month invoice. | Resolved |
| Will teachers and accountants use separate subdomains? | Affects routing and bundle division. | Unified `/{schoolCode}/...` route tree with role-gated navigation. | Resolved |

---

## 7. Constraints

- Framework: Next.js (Pages Router) + React.
- State Management: Redux Toolkit.
- Styling: Tailwind CSS + `styled-components` adhering to `ECO Design System 1.0` (Yellow `#FEC020`, Blue `#0070CE`).
- Backend API: PHP / Laravel Sanctum REST API at `/{schoolCode}/api/1.0/...`.
- Infrastructure: Google Cloud Run + OpenResty reverse proxy.

---

## 8. Risks

- `RISK-001`: Facial recognition processing delay during high-volume photo uploads; mitigated by asynchronous background worker queues.
- `RISK-002`: Concurrent teacher check-in conflicts during peak morning hours; mitigated by optimistic UI mutations and backend idempotency.

---

## 9. Traceability

- Module inventory: `docs_legacy/operating-portal/00-inventory.md`
- Operations specs: `docs_legacy/operating-portal/van-hanh/`
- Academic specs: `docs_legacy/operating-portal/hoc-tap/`
- Finance specs: `docs_legacy/operating-portal/tai-chinh/`
- Design tokens: `ECO Design System/readme.md`
- Root memory: `agents.md`

---

## 10. Review Loop

- `R01`: Product & Scope Challenge Review — Validated module inventory and user stories against legacy PRD documents with zero scope creep.
- `R02`: Architecture & Security Challenge Review — Verified Next.js Pages Router, Laravel Sanctum tenant routing, and OpenResty edge proxy contracts.
- `R03`: Quality & Verification Review — Verified complete acceptance criteria, negative test vectors, and automated Playwright test plans.

---

## Out of Scope

- Direct native mobile source code development for the parent mobile app.
- Provincial Education Department external CSDL Sở database sync.
- Automated gate turnstile hardware firmware flashing.
