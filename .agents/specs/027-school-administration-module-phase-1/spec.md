# Feature Specification: School Administration Module Phase 1

> Feature ID: `027-school-administration-module-phase-1`
> Created: `2026-09-15`
> Status: Approved Planning Specification
> Source Prompt: Planning Module NHÀ TRƯỜNG including first 5 sub-modules: Học Sinh, Giáo Viên, Lớp Học, Môn Học, Khối Lớp

## 1. Purpose

The School Administration Module ("Nhà Trường") establishes the institutional master data backbone for the entire School Operating Portal. It manages the core entity relationships across Students (Học Sinh), Teachers (Giáo Viên), Classes (Lớp Học), Subjects (Môn Học), and Grade Levels (Khối Lớp). 

This Phase 1 slice delivers the foundational operational data hub:
1. **Học Sinh:** Student records, 360° profile hub with multi-parent contact cards, per-student tuition overrides, physical health records with BMI tracking, individual class transfers, and bulk academic year grade transitions ("Chuyển năm học").
2. **Giáo Viên:** Faculty directory, homeroom vs teaching assignments, account invitation dispatch, and a two-tier content moderation pipeline ("Giáo viên chính" auto-publishes vs "Giáo viên hỗ trợ" queued for approval).
3. **Lớp Học:** Dual class taxonomy separating regular curricular classes ("Lớp chính khóa") from extracurricular classes ("Lớp ngoại khóa") with purposeful feature degeneration, homeroom teacher allocation, and strict zero-student deletion safeguards.
4. **Môn Học:** Subject curriculum catalog organized across 4 educational levels (TH, THCS, THPT, GDTX) and academic years, read-only term evaluation rubrics, and deduplicated administrative teacher assignments.
5. **Khối Lớp:** Grade level hierarchy oversight across the 4 educational tiers with aggregate headcount analytics and reactive client-side search resolution.

## 2. User Stories

- [x] As a School Admin, I need to manage student master records across academic years with 360° profile hubs so that student identity, parents, tuition overrides, and growth metrics are centrally accessible.
- [x] As a School Admin, I need to execute class transfers and annual promotions with automatic fee remapping, chat group revocation, and evaluation pruning so that student transitions maintain data integrity.
- [x] As a School Admin, I need to manage faculty rosters, assign homeroom/teaching duties, send login invitations, and enforce two-tier activity moderation so that teacher permissions are strictly governed.
- [x] As a School Admin, I need to configure curricular and extracurricular classes with appropriate feature gating and delete protection so that active classes are never accidentally lost.
- [x] As a School Admin, I need to browse subject catalogs across 4 educational levels, view term evaluation rubrics, and allocate teaching staff so that curriculum delivery is staffed accurately.
- [x] As a School Admin, I need an aggregate overview of grade levels with reactive instant search so that grade structures and headcounts are immediately visible.

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

## 4. Non-Functional Requirements

- `NFR-001`: Performance: Directory tables (students, teachers, classes, subjects, grades) must render within 500ms on client navigation. Client-side reactive search on grade levels must respond in less than 50ms.
- `NFR-002`: Security: Teacher credentials must be encrypted; invitations dispatch one-time onboarding tokens; email changes require explicit modal confirmation.
- `NFR-003`: Observability: Critical operations (student transfers, teacher invitations, class deletions, faculty subject assignments) dispatch audit log events.
- `NFR-004`: Maintainability: Reused tabs in student detail hub ("Hoạt Động", "Thư Viện", "Điểm Danh", "Học Phí") encapsulate sub-module components with injected `kidId` context rather than duplicated component code.
- `NFR-005`: Data Integrity: Class deletion strictly enforces the zero-student invariant (`studentCount === 0`) at both UI and Redux reducer boundaries.

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

## 6. Clarifications

### Question Back Protocol

Before planning or execution, ask back when any answer can change scope, user behavior, security posture, data ownership, rollback, verification, or cost. Each question must name the decision it protects.

### Clarification Ledger

| Question | Why It Matters | Answer or Accepted Risk | Status |
| --- | --- | --- | --- |
| How should multi-class homeroom teacher assignments be handled when editing a class? | Prevents accidental duplicate teacher assignment while accommodating multi-class policies. | Form allows selection but renders an amber status warning badge if teacher already homerooms another class. | Resolved (K006) |
| How should defective server search on Khối Lớp be mitigated? | Legacy API returns empty results for any search parameter `q` and fails to reload. | Implemented client-side reactive substring filtering in Redux/React store, ensuring instant results and instant restoration on clear. | Resolved (K007) |
| How should legacy student records lacking Student Code or CCCD be presented? | Form requires these fields, but legacy demo data contains blank records. | Form validates them on new entry; existing null records display graceful italic placeholder "Chưa có mã học sinh" without errors. | Resolved (K008) |

## 7. Constraints

- Framework: Next.js (Pages Router) with dynamic routing `pages/[schoolCode]/school/...`
- State Management: Redux Toolkit slice architecture (`studentSlice.ts`, `teacherSlice.ts`, `classSlice.ts`, `subjectSlice.ts`, `gradeSlice.ts`)
- Styling: Mixed Tailwind CSS for layout + `styled-components` for encapsulated UI primitives.
- Design System: ECO Design System 1.0 (Yellow `#FEC020`, Blue `#0070CE`, Vietnamese typography).
- Interaction Standards: Universal logic change confirmation pop-ups, top-right global toast notifications (`addToast`), Sentence case headers, and `•••` action dropdowns.
- Out of scope: The remaining 9 sub-modules of Nhà Trường (Bảng Thông Tin, Bình Chọn, Thực Đơn, Điểm Danh NV, Sổ Tay PH, Góp Ý, Lịch Sự Kiện, Năm Học, Lưu Trữ) will be planned in Phase 2.

## 8. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Orphaned student records on class deletion | High | Enforce strict invariant hiding delete button unless `studentCount === 0`. |
| Cross-module state sync lag in Student Profile Hub | Medium | Hydrate child module contexts synchronously using Redux selectors bound to active `kidId`. |
| Unintended teacher activity auto-publishing | Medium | Default newly added teachers to "Giáo viên hỗ trợ" requiring explicit administrative promotion to "Giáo viên chính". |

---

## 9. Traceability

- Legacy Functional Specifications: `docs_legacy/operating-portal/nha-truong/` (`hoc-sinh.md`, `giao-vien.md`, `lop-hoc.md`, `mon-hoc.md`, `khoi-lop.md`).
- System PRD: `docs/prd.md` (Section 4.4, Section 5, AC-024 to AC-028).
- Architectural Decision Records: `docs/decisions.md` (ADR-008, ADR-009).
- Architecture & Diagrams: `docs/planning/diagrams.md` (Section 11).
- Execution Tasks: `docs/tasks.md` (TASK-SCH-001 to TASK-SCH-005).

---

## 10. Review Loop

- `R01`: Product & Scope Alignment Review — Verified all 5 sub-modules (Học Sinh, Giáo Viên, Lớp Học, Môn Học, Khối Lớp) against legacy specifications and PRD acceptance criteria AC-024 to AC-028 with zero scope creep.
- `R02`: Architecture & Guardrail Integrity Review — Validated class deletion invariant (`studentCount === 0`), extracurricular feature degeneration, two-tier teacher moderation pipeline, and tripartite student transition cascades.
- `R03`: Quality & Verification Gate Review — Confirmed complete test suite specifications, reactive search fix validation, and live HTTP 200 telemetry coverage.

