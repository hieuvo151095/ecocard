# Feature Specification: School Administration Module Phase 3

> Feature ID: `029-school-administration-module-phase-3`  
> Created: `2026-09-15`  
> Status: Accepted  
> Source Prompt: School Administration Phase 3: Gop Y, Lich Su Kien, Nam Hoc, Luu Tru  

---

## 1. Purpose

The purpose of School Administration Phase 3 is to deliver the final four governance and lifecycle modules for the School Operating Portal:
1. **Góp Ý (Parent Feedback & Inquiries):** A ticketing management inbox enabling administrators to review incoming parent feedback, classify inquiries across 8 categories, assign internal handlers, manage 4 priority tiers, conduct 2-way discussions with image attachments, and track tickets through a 4-state lifecycle (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`).
2. **Lịch Sự Kiện (Event & Holiday Calendar):** Institutional schedule and holiday calendar supporting 3 synchronized view modes (12-month Year grid, 1-month detailed Calendar, and chronological Event list with tear-away calendar cards), categorized into 3 semantic color codes (Holidays, Internal events, Parent-invited events), with multi-year temporal navigation (2021–2028+).
3. **Năm Học (Academic Years & Terms):** Core temporal boundaries defining academic years and nested terms, automatically resolving and displaying the "Hiện tại" (Current) badge based on system date to feed dynamic filters across portal modules.
4. **Lưu Trữ (Archived Students Roster):** A dedicated repository for withdrawn student records preserving historical enrollment, leaving dates, staff actors, and withdrawal reasons, while providing safe restoration to active rosters or permanent system deletion under strict confirmation guards.

---

## 2. User Stories

- [ ] `US-SCH-12`: As a School Administrator, I need a centralized feedback inbox so that I can triage, assign, and resolve parent inquiries with two-way communication threads.
- [ ] `US-SCH-13`: As a School Administrator, I need a comprehensive multi-view event and holiday calendar so that I can schedule school terms, breaks, and community events with visual category distinction.
- [ ] `US-SCH-14`: As a School Administrator, I need a straightforward academic year configuration registry so that system-wide date filters accurately reflect current and historical school years.
- [ ] `US-SCH-15`: As a School Administrator, I need an archived student repository so that withdrawn learners are separated from active class rosters without losing historical audit trails, while retaining restoration and purge capabilities.
- [ ] `US-SCH-16`: As an internal operator, I need audit logs on ticket closure, event deletion, and permanent student purging so that data operations remain strictly accountable and compliant with privacy policies.

---

## 3. Functional Requirements

### Phân hệ Góp Ý (Feedback & Inquiries)
- `FR-SCH-031`: The system MUST display feedback tickets scoped to the currently selected academic year (defaulting to the term tagged `Hiện tại`).
- `FR-SCH-032`: The system MUST provide 4 status summary cards (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`) that act as clickable filters while persistently retaining independent global ticket counts across all statuses (`K012`).
- `FR-SCH-033`: The system MUST support ticket categorization across 8 standard domains: Góp ý về nội dung, Hình thức/trình bày, Hiệu suất/chất lượng, Kỹ năng, Thái độ/hành vi, Quy trình, Trải nghiệm người dùng, and Mang tính chiến lược.
- `FR-SCH-034`: The system MUST support 4 priority tiers (`Thấp`, `Trung bình`, `Cao`, `Khẩn cấp`) modifiable inline directly on table rows and within ticket details.
- `FR-SCH-035`: The system MUST track waiting state via "Chờ phản hồi" filter (`Chờ phản hồi từ phụ huynh` vs `Chờ phản hồi từ nhà trường`), toggling waiting side upon message submission.
- `FR-SCH-036`: The system MUST require modal confirmation prior to closing a ticket (`Đóng góp ý`) to transition its status to `Hoàn tất`.

### Phân hệ Lịch Sự Kiện (Event & Holiday Calendar)
- `FR-SCH-037`: The system MUST render the event calendar across 3 view modes (`Năm` [12-month grid], `Tháng` [1-month grid], `Sự kiện` [chronological list]).
- `FR-SCH-038`: The system MUST color-code events according to 3 fixed categories: `Ngày nghỉ` (pink/red), `Sự kiện nội bộ` (cyan), `Sự kiện có mời phụ huynh` (orange).
- `FR-SCH-039`: The system MUST auto-default `Đến ngày` to match `Từ ngày` when creating or editing a single-day event, eliminating redundant manual input (`K014`).
- `FR-SCH-040`: In `Sự kiện` list mode, the system MUST render tear-away calendar date cards, support filtering between `Sự kiện sắp tới` and `Tất cả sự kiện`, and provide direct inline edit and delete actions.

### Phân hệ Năm Học (Academic Years & Terms)
- `FR-SCH-041`: The system MUST manage academic years via a minimal 3-field form (`Tên năm học`, `Ngày bắt đầu`, `Ngày kết thúc`).
- `FR-SCH-042`: The system MUST dynamically compute and display the `Hiện tại` badge on the academic year whose date interval contains current system time (`BR01`).
- `FR-SCH-043`: The system MUST prevent exact date interval overlaps between top-level academic years while permitting nested semester terms (`K015`).
- `FR-SCH-044`: The system MUST enforce that academic years cannot be deleted from the UI to protect foreign key integrity across dependent modules (`BR03`).

### Phân hệ Lưu Trữ (Archived Students Roster)
- `FR-SCH-045`: The system MUST list archived students with withdrawal metadata: withdrawal date, staff operator link, and withdrawal reason (`BR02`).
- `FR-SCH-046`: The system MUST provide student detail modal viewing with a prominent warning banner (`🔒 Học sinh đã được lưu trữ`) and read-only field presentation (`BR03`).
- `FR-SCH-047`: The system MUST require modal confirmation before executing `Phục hồi` (restoration), restoring student to active rosters with class continuity check (`K013`).
- `FR-SCH-048`: The system MUST require modal confirmation before executing `Xóa` (permanent purge), permanently removing the student record from the system (`BR06`).

---

## 4. Non-Functional Requirements

- `NFR-001`: Performance: In-memory client-side search and filtering across tickets, calendar events, and archive rosters must execute under 50ms without UI stutter.
- `NFR-002`: Security: Permanent deletion of student archives and closure of tickets must enforce role-based authorization (Admin only).
- `NFR-003`: Observability: All status changes, ticket discussions, and student purge events must emit structured telemetry logs.
- `NFR-004`: Usability: Forms with unsaved changes must prompt confirmation on exit; pristine forms must navigate back immediately (`K010`).
- `NFR-005`: Documentation and Traceability: All business rules must map directly to legacy specifications in `docs_legacy/operating-portal/nha-truong/`.

---

## 5. Acceptance Criteria

- `AC-034`: Given a list of feedback tickets, when an administrator clicks the `Đang xử lý` filter card, the ticket table filters to processing tickets while all 4 status count badges retain their correct global totals (`K012`).
- `AC-035`: Given a ticket detail view, when an administrator submits a discussion response, the message appears in the timeline and the waiting state updates to `Chờ phản hồi từ phụ huynh` (`FR-SCH-035`).
- `AC-036`: Given the event calendar, when toggling between `Năm`, `Tháng`, and `Sự kiện` views, the event dataset for the selected year remains consistent with proper category color bands (`FR-SCH-037`, `FR-SCH-038`).
- `AC-037`: Given an event creation form, when the administrator selects a start date `15/10/2026`, the end date automatically defaults to `15/10/2026` (`K014`).
- `AC-038`: Given the academic year roster, the academic year containing today's date automatically displays the green `Hiện tại` badge without manual intervention (`FR-SCH-042`).
- `AC-039`: Given an archived student, when the administrator clicks `Phục hồi` and confirms, the student is re-enrolled into active rosters with historical records preserved (`K013`).
- `AC-040`: Given an archived student, when the administrator clicks `Xóa` and confirms, the student is permanently purged with standard toast notification feedback (`FR-SCH-048`).

---

## 6. Clarifications

### Clarification Ledger

| Question | Why It Matters | Answer or Accepted Risk | Status |
| --- | --- | --- | --- |
| Should feedback status cards filter list while keeping independent counters? | In legacy UI counters all dropped to 0 when filtered, confusing admins. | Cards act as clickable filters while preserving global totals across all cards. | Resolved (K012) |
| How to handle class assignment when restoring an archived student? | If former class is no longer active, student cannot be assigned to it. | Preserves class if active; sets to 'Chưa xếp lớp' with warning if inactive. | Resolved (K013) |
| Should single-day event end date be manually selected? | Selecting the exact same date twice causes unnecessary friction. | Auto-populates 'Đến ngày' from 'Từ ngày' for 1-day events. | Resolved (K014) |
| Can academic years have overlapping calendar dates? | Overlapping school years corrupt portal-wide date filtering. | Enforces non-overlapping intervals for full school years; allows nested semesters. | Resolved (K015) |

---

## 7. Constraints

- Framework: Next.js (Pages Router) with dynamic routing `pages/[schoolCode]/...`
- State Management: Redux Toolkit slice architecture (`feedbackSlice.ts`, `calendarSlice.ts`, `academicYearSlice.ts`, `archiveSlice.ts`).
- Styling: Tailwind CSS for layout + `styled-components` for encapsulated atomic UI elements.
- Design System: ECO Design System 1.0 (Yellow `#FEC020`, Blue `#0070CE`, Vietnamese typography).
- Interaction Standards: Universal confirmation modals on destructive actions, standard global toasts (`addToast`), Sentence case table headers, and `•••` action dropdowns.
- Out of scope:
  - Creating new feedback tickets directly from the Web Admin portal (tickets originate strictly from the parent mobile app).
  - Synchronizing events with external calendars (Google Calendar, Microsoft Outlook, CalDAV).
  - Recurring event automation (daily, weekly, or monthly recurring event rules).
  - Direct student archiving from within the Lưu Trữ module (archiving is executed in Học Sinh).
  - Permanent deletion of academic years (strictly disabled to prevent foreign key corruption).

---

## 8. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Accidental permanent purge of student records | High | Two-step confirmation dialog requiring explicit student name re-verification. |
| Overlapping academic years distorting term filters | Medium | Strict interval overlap validation in `academicYearValidation.ts`. |
| Unsaved discussion comments or event forms lost on navigation | Low | Standardized dirty-form cancellation confirmation modal (`K010`). |

---

## 9. Traceability

- Legacy Functional Specifications: `docs_legacy/operating-portal/nha-truong/` (`gop-y.md`, `lich-su-kien.md`, `nam-hoc.md`, `luu-tru.md`).
- System PRD: `docs/prd.md` (Section 4.6, Section 5, AC-034 to AC-040).
- Architectural Decision Records: `docs/decisions.md` (ADR-011).
- Architecture & Diagrams: `docs/planning/diagrams.md` (Section 13).
- Execution Tasks: `docs/tasks.md` (TASK-SCH-011 to TASK-SCH-015).

---

## 10. Review Loop

- `R01`: Product & Scope Alignment Review — Verified all 4 sub-modules (Góp Ý, Lịch Sự Kiện, Năm Học, Lưu Trữ) against legacy specifications and PRD acceptance criteria AC-034 to AC-040 with zero scope creep.
- `R02`: Architecture & Guardrail Integrity Review — Validated ticket status card isolation, event date auto-fill, academic year overlap guards, and student archive class continuity protocols.
- `R03`: Quality & Verification Gate Review — Confirmed complete test suite specifications, clean build requirements, and live HTTP 200 telemetry coverage.
