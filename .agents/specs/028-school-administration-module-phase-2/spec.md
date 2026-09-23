# Feature Specification: School Administration Module Phase 2 (Nhà Trường)

> Feature ID: `028-school-administration-module-phase-2`
> Created: `2026-09-15`
> Status: Approved Planning Specification
> Source Prompt: Planning Module NHÀ TRƯỜNG including sub-modules 6-10: Bảng Thông Tin, Bình Chọn, Thực Đơn, Điểm Danh NV, Sổ Tay PH

## 1. Purpose

Phase 2 of the School Administration Module ("Nhà Trường") expands operational governance across internal and external school stakeholder communication, nutrition management, daily staff operations, and organized institutional knowledge:

1. **Bảng Thông Tin (`/announcement/`):** Centralized multi-channel broadcasting hub enabling school administrators to author, preview, schedule, and distribute rich announcements to whole-school, teacher-only, parent-only, or class-specific cohorts via mobile push notifications and emails.
2. **Bình Chọn (`/school/poll/`):** Interactive stakeholder sentiment and survey instrument allowing administrators to formulate multi-option inquiries, dynamically target classes or the whole institution, track real-time voting progress with visual pie charts, and audit per-student vote revision trails.
3. **Thực Đơn (`/school/menu/`):** Nutritional planning and publication platform covering weekly meal schedules (up to 8 weeks ahead) with automatic class-to-schoolwide fallback inheritance, dual authoring modalities (structured grid vs uploaded graphic/PDF), and granular food safety traceability (GTIN + Lot number with supplier resolution or internal stamp codes).
4. **Điểm Danh NV (`/school/staff-attendance/`):** High-throughput daily staff check-in/check-out roster across all institutional roles (Admin, Quản Lý, Giáo Viên, Nhân Viên), enforcing single-click rapid recording, a 45-day retroactive edit boundary, mutual exclusivity of absent markings, and contextual metric suppression during search.
5. **Sổ Tay PH (`/school/handbook/`):** Structured parent FAQ and institutional handbook organized as a strict 2-tier category hierarchy with sibling accordion expansion, drag-and-drop ordering, rich-text drafting, publishing toggles, and cascading deletion protection.

## 2. User Stories

- [x] As a School Admin, I want to compose, preview, schedule, and broadcast announcements to whole-school, teacher, parent, or class cohorts via app push and email, and manage them in bulk.
- [x] As a School Admin, I want to formulate surveys with multi-option selection, decouple drafting from audience dispatch, and analyze live voting participation with progress bars, dynamic pie charts, and revision logs.
- [x] As a School Admin, I want to plan weekly meal menus up to 8 weeks ahead in grid or file formats, with automatic class fallback to school-wide schedules and food safety ingredient traceability.
- [x] As a School Admin, I want to record daily staff clock-in/out timestamps instantly with single-click actions, manage absence requests with modal confirmations, and edit logs within a 45-day retroactive window.
- [x] As a School Admin, I want to organize parent guidelines and FAQs in a strict 2-tier category tree with accordion interaction, draft rich-text articles, toggle publishing states, and delete categories safely with cascading warnings.

## 3. Functional Requirements

- `FR-016`: The system MUST provide an announcement management roster (`/announcement/`) filterable by status (`Bản nháp`, `Chưa gửi`, `Đã gửi`) and category (Thông báo chung, Kế hoạch học tập, Thực đơn, Sự kiện, Lịch nghỉ, Thời khóa biểu), with case-insensitive search.
- `FR-017`: The system MUST enforce announcement life-cycle states where only drafts can be edited, scheduled announcements broadcast on their designated timestamp, and deletions display warnings that delivered emails cannot be recalled.
- `FR-018`: The system MUST provide a live visual preview modal simulating the recipient's mobile/web card layout before sending.
- `FR-019`: The system MUST provide a poll builder (`/school/poll/`) requiring Title, Deadline, $\ge 2$ options, and configuration toggles for multi-choice and parent result visibility.
- `FR-020`: The system MUST decouple poll drafting from audience dispatch, permitting administrators to broadcast an existing draft to the whole school or specific classes (`INFANT; Lá`).
- `FR-021`: The system MUST render live voting analytics with progress bars, conditionally display an interactive SVG pie chart only when total votes $> 0$, and log per-student vote modification histories.
- `FR-022`: The system MUST support weekly meal menus (`/school/menu/`) up to 8 weeks ahead in dual formats: Mon–Sat $\times$ 3-meal grid editor or uploaded graphic/PDF.
- `FR-023`: The system MUST dynamically fallback to the school-wide (`Toàn trường`) weekly menu for any class lacking a custom weekly menu override.
- `FR-024`: The system MUST support food safety provenance on grid dishes via GTIN + Lot number (auto-resolving supplier names) or internal stamp codes, and restrict cloning exclusively to grid menus.
- `FR-025`: The system MUST support dual menu publishing: silent publication vs broadcast integration creating an announcement in Bảng Thông Tin.
- `FR-026`: The system MUST provide daily staff attendance (`/school/staff-attendance/`) with single-click Check-in/out instant timestamping and inline badge editing.
- `FR-027`: The system MUST enforce modal confirmations for marking staff Absent (`Có phép` vs `Không phép`), disabling Check-in/out buttons while active.
- `FR-028`: The system MUST enforce a 45-day retroactive calendar selection limit while strictly disabling future dates, and suppress aggregate KPI counters during text search.
- `FR-029`: The system MUST maintain a parent handbook (`/school/handbook/`) restricted to a strict 2-tier category hierarchy (Root $\rightarrow$ Sub-category $\rightarrow$ Articles) with single-sibling accordion expansion.
- `FR-030`: The system MUST support rich-text article drafting with dual save options (`Lưu nháp` vs `Lưu & Xuất bản`), publishing/hiding toggles, and cascading deletion confirmation for categories.

## 4. Non-Functional Requirements

- `NFR-006`: Performance: Staff clock-in actions must execute with optimistic UI updates in $< 50\text{ms}$. Substring searches on rosters and handbooks must respond in $< 16\text{ms}$.
- `NFR-007`: Security & Data Integrity: Destructive actions across all 5 sub-modules enforce confirmation dialogs. Email non-retraction caveats are explicitly communicated.
- `NFR-008`: Usability & Accessibility: All status badges and progress visualizations must exceed WCAG 2.1 AA contrast requirements ($> 4.5:1$).
- `NFR-009`: Responsive Ergonomics: Menus, staff rosters, and handbook tree layouts must render gracefully across mobile ($375\text{px}$), tablet, and desktop viewports.
- `NFR-010`: Maintainability: Reused components leverage strict TypeScript contracts with zero `any` usage.

## 5. Acceptance Criteria

- `AC-019`: Announcement table displays title, send date, audience, view counts, and standardized `•••` action dropdowns. Bulk deletion prompts email permanence warnings.
- `AC-020`: Announcement preview modal faithfully renders mobile card simulation without requiring all optional fields.
- `AC-021`: Poll creation validates $\ge 2$ options and deadline. Audience dispatch modal supports selecting whole school or class multi-selection.
- `AC-022`: Poll analytics view renders option progress bars and displays an SVG pie chart only when total votes $> 0$. Vote revision modal audits timestamped changes.
- `AC-023`: Weekly meal menu editor supports 8-week horizon, Mon–Sat grid, and file uploads. Classes without custom menus inherit the school-wide menu.
- `AC-024`: Ingredient traceability card parses GTIN + lot numbers and displays supplier names. Grid menus can be cloned; file menus omit the clone button.
- `AC-025`: Staff attendance records Check-in/out with a single click and immediate success toast. Marking Absent enforces modal confirmation.
- `AC-026`: Staff attendance calendar allows selecting dates within 45 days in the past and locks future dates. Searching by name suppresses the 3 top KPI summary counters.
- `AC-027`: Parent handbook enforces a 2-tier depth limit, disabling sub-category creation inside sub-categories. Accordion maintains single-sibling active expansion.
- `AC-028`: Category deletion prompts an explicit warning that all child sub-categories and articles will be deleted. Articles support rich text and publishing toggles.

## 6. Clarifications

### Clarification Ledger

| Question | Why It Matters | Answer or Accepted Risk | Status |
| --- | --- | --- | --- |
| Should staff attendance check-in require a confirmation modal? | High volume morning clock-in would suffer severe throughput friction if prompted with modals. | Routine check-in/out uses single-click optimistic recording with success toast; destructive actions (absent marking, manual past edits) require modals. | Resolved (K009) |
| Should clicking cancel on creation forms exit immediately or confirm? | Inconsistent form cancellation creates risk of accidental data loss. | Standardized: dirty forms prompt confirmation modal on cancel; pristine forms exit immediately. | Resolved (K010) |
| How are cross-module menu announcements synchronized upon update or deletion? | Menus published via announcement board can lead to orphaned or outdated notices. | Menus store `linkedAnnouncementId`; updates modify notice payload; notice deletion detaches link without destroying menu schedule. | Resolved (K011) |

## 7. Constraints

- Framework: Next.js (Pages Router) with dynamic routing `pages/[schoolCode]/...`
- State Management: Redux Toolkit slice architecture (`announcementSlice.ts`, `pollSlice.ts`, `menuSlice.ts`, `staffAttendanceSlice.ts`, `handbookSlice.ts`).
- Styling: Tailwind CSS for layout + `styled-components` for encapsulated atomic UI elements.
- Design System: ECO Design System 1.0 (Yellow `#FEC020`, Blue `#0070CE`, Vietnamese typography).
- Interaction Standards: Universal confirmation modals on destructive actions, standard global toasts (`addToast`), Sentence case table headers, and `•••` action dropdowns.
- Out of scope: Sub-modules 11–14 (Góp Ý, Lịch Sự Kiện, Năm Học, Lưu Trữ) will be planned in Phase 3. Real email SMTP dispatch and hardware biometric clock-in integrations are mocked.

## 8. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| User confusion regarding unrecallable broadcast emails | High | Explicitly communicate email permanence in single and bulk deletion confirmation dialogs. |
| Missing meal schedules for unconfigured classes | Medium | Enforce automatic class fallback to the school-wide weekly menu. |
| Misinterpretation of staff attendance search results | Medium | Automatically hide the 3 aggregate school-wide KPI counters during text search filtering. |
| Accidental mass deletion of handbook documentation | High | Enforce cascading deletion warning dialog detailing child sub-categories and articles to be removed. |

## 9. Traceability

- Legacy Functional Specifications: `docs_legacy/operating-portal/nha-truong/` (`bang-thong-tin.md`, `binh-chon.md`, `thuc-don.md`, `diem-danh-nv.md`, `so-tay-ph.md`).
- System PRD: `docs/prd.md` (Section 4.4, Section 5, AC-029 to AC-033).
- Architectural Decision Records: `docs/decisions.md` (ADR-010).
- Architecture & Diagrams: `docs/planning/diagrams.md` (Section 12).
- Execution Tasks: `docs/tasks.md` (TASK-SCH-006 to TASK-SCH-010).

---

## 10. Review Loop

- `R01`: Product & Scope Alignment Review — Verified all 5 sub-modules (Bảng Thông Tin, Bình Chọn, Thực Đơn, Điểm Danh NV, Sổ Tay PH) against legacy specifications and PRD acceptance criteria AC-029 to AC-033 with zero scope creep.
- `R02`: Architecture & Guardrail Integrity Review — Validated rapid staff clock-in exception, menu inheritance fallback, food traceability schemas, and 2-tier handbook cascading deletion guards.
- `R03`: Quality & Verification Gate Review — Confirmed complete test suite specifications, clean build requirements, and live HTTP 200 telemetry coverage.
