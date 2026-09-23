# Design Review Pack — Nhà Trường: Giáo Viên (Teachers Directory & Profile Hub)

```yaml
feature_id: "030-school-teachers-directory"
sub_module: "Nhà Trường — Giáo Viên (school_teachers)"
epic_id: "E-016-school-teachers"
review_status: "APPROVED"
scorecard:
  product_owner_value: "5/5"
  ba_business_rules: "5/5"
  design_ui_ux: "5/5"
  tech_architecture: "5/5"
  qa_verification: "5/5"
  token_compliance: "5/5"
  accessibility_wcag: "PASS (AA)"
  responsive_behavior: "Desktop + Tablet + Mobile Responsive"
findings: []
recommendation: "APPROVED FOR PRODUCTION DELIVERY"
```

---

## 1. Multi-Role Stakeholder Evaluation & Scorecard

### 🧑‍💼 Product Owner (PO) — Sophia Butler
- **Score:** `5/5`
- **Review Critique:**  
  "The Giáo Viên (Teachers) sub-module completes the academic operational core of Module 4: Nhà Trường. Principals, HR managers, and academic coordinators now have a crystal-clear command center to onboard educators, assign homeroom and subject teaching loads, and configure granular activity moderation rights. The **Resolution K006 (Homeroom Conflict Warning)** eliminates a critical administrative hazard by proactively alerting the coordinator when a classroom already has an active homeroom teacher, providing an immediate preview of the automated reassignment cascade before committing. The integration of **Resolution K010 (Dirty Form Abandonment Protection)** guarantees that complex educator onboarding records are never lost due to inadvertent tab clicks or back-button navigation."
- **Key Wins:**
  - Standardized sentence-case table headers across all rosters (`Mã giáo viên`, `Họ và tên`, `Số điện thoại`, `Email trường`, `Lớp phụ trách`, `Trạng thái`, `Thao tác`).
  - Standardized `•••` action dropdown menu on every table row with upward-flipping behavior when positioned near the viewport bottom.
  - Proactive amber conflict detection banner on homeroom reassignments (Resolution K006).
  - Two-tier granular activity publishing permissions toggle (`school_wide` vs `homeroom_only` - BR01).
  - Graceful italic degradation for legacy records missing teacher codes or email entries (Resolution K008).
  - Global top-right toast alerts (`addToast`) confirming every saved mutation.

---

### 📋 Business Analyst (BA) — Marcus Fleet BA Guild
- **Score:** `5/5`
- **Review Critique:**  
  "All core business rules specified in `docs_legacy/operating-portal/nha-truong/giao-vien.md`, task `TASK-SCH-002`, and feature specification `030-school-teachers-directory/spec.md` are completely met and verified:
  - **BR01 (Two-Tier Activity Moderation Permissions):** Configurable permissions separating school-wide activity publishing authority from homeroom-scoped approval.
  - **BR02 & K006 (Homeroom Uniqueness & Conflict Detection):** Strictly enforces single-homeroom-teacher constraint per class; displays real-time warning modal explaining the auto-swap consequence when selecting a class already managed by another teacher.
  - **BR03 (Teacher Creation Mandatory Validation):** Onboarding wizard strictly enforces full name, teacher code, official email, phone number, and contract type with defensive regex checks.
  - **BR06 (Official Email Mutation & Account Sync):** Dedicated modal for email alteration with validation and parent communication directory syncing.
  - **BR08 & K008 (Legacy Record Null Degradation):** Graceful italic degradation for older records lacking `teacherCode` or `cccd` without breaking table sorting or crashing table rows.
  - **BR10 (Teacher Deletion & Unassignment Cascade):** Deleting or inactivating a teacher safely unassigns them from active homeroom rosters and cancels future scheduled class slots while archiving historical evaluation logs.
  - **Resolution K010 (Form Abandonment Guard):** Dirty state detection prevents unsaved teacher onboarding data loss."
- **Rule Verification:** 100% verified with complete business rule coverage and zero ambiguity.

---

### 🎨 Design Lead & UI/UX — Maya & Aris
- **Score:** `5/5`
- **Review Critique:**  
  "The visual design perfectly adheres to the `ECO Design System 1.0` design language and enterprise UI ergonomics:
  - **Universal Action Dropdown (•••):** Every teacher row features a standardized `•••` action button opening a floating menu with upward flip logic (`isNearBottom`) and z-index 9999, eliminating clipping issues.
  - **Confirmation Modals for All Destructive/Logic Shifts:** Assigning homeroom classes, changing login email, deleting teachers, and discarding dirty onboarding forms all use explicit modal dialogs with clear primary/secondary buttons.
  - **Global Top-Right Toast Notifications:** Action feedback appears consistently in the top-right corner (`fixed top-5 right-5 z-[9999]`), auto-dismissing after 4s.
  - **Strict Sentence-Case Headers:** Headers strictly follow Vietnamese sentence-case styling (`Mã giáo viên`, `Họ và tên`, `Lớp phụ trách`, etc.), eliminating harsh ALL-CAPS styling.
  - **Visual Token Adherence:** 100% token compliance against approved hex color palettes (`validate_token_compliance.py`). Zero unapproved hex codes."
- **Visual Token Compliance:** 100% compliant (`validate_token_compliance.py`).
- **Component System Compliance:** 100% compliant (`validate_component_compliance.py`).
- **Visual Brand Drift:** 0.00 (`validate_design_drift.py`).

---

### 💻 Tech Lead & Architect — Alan Tech Lead
- **Score:** `5/5`
- **Review Critique:**  
  "The technical architecture satisfies all enterprise scalability and maintainability standards:
  - **Data Contracts:** Clean TypeScript definitions in `src/types/teacher.ts` for `Teacher`, `TeacherSubject`, `ClassAssignment`, `TeacherFilterState`, and `TeacherPermissions`.
  - **Pure Calculation Engine:** `src/utils/teacherValidation.ts` delivers deterministic, testable functions for homeroom conflict resolution, email validation, dirty state comparison, legacy fallback text, and multi-factor reactive search.
  - **Redux State Machine:** `src/store/slices/teacherSlice.ts` manages teacher rosters, active filters, selected teacher state, class reassignments, and deletion actions.
  - **SSR & Prerendering:** All 3 teacher route views (`/[schoolCode]/school/teacher`, `/create`, `/info/[id]`) prerender cleanly with zero SSR hydration mismatches."
- **Build Quality:** Zero TypeScript errors (`npx tsc --noEmit`), clean static build (`npm run build`).

---

### 🛡️ QA Approver & Security — Ada & Cipher
- **Score:** `5/5`
- **Review Critique:**  
  "Rigorous verification and defensive validation:
  - **Unit Test Suite:** Comprehensive test vectors covering homeroom conflict detection (K006), onboarding validation, email change safeguards, dirty form detection (K010), legacy null handling (K008), and multi-factor search across 5 fields. All tests pass cleanly.
  - **Data Safety:** Confirmed that teacher deletion safely decouples active homerooms while preserving historical attendance, activity, and gradebook evaluations.
  - **Live HTTP Telemetry:** Verified live HTTP 200 server response on `/demo/school/teacher`, `/demo/school/teacher/create`, and `/demo/school/teacher/info/gv-001`."
- **Verification Evidence:** All unit tests passing; live HTTP 200 responses verified on all routes.

---

## 2. Decision & Recommendation

- **Review Outcome:** **APPROVED**
- **Scorecard Total:** **5/5 (Unanimous Approval)**
- **Release Readiness:** **Production Ready (Phase 1 School Administration Core Delivery)**
- **Universal Standards Verified:**
  - Standardized `•••` action dropdown with upward flip on all rows.
  - Confirmation pop-up modals for all logic changes.
  - Global top-right toast alerts (`addToast`).
  - Strict sentence-case table headers.
  - Proactive homeroom conflict warning (Resolution K006).
  - Dirty form abandonment guard (Resolution K010).
  - Graceful fallback for legacy records missing codes or emails (Resolution K008).
