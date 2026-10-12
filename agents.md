# Project Memory: ECO Card Portal Rebuild

## Overview
Rebuilding the **ECO Card Portal** web application, beginning with Module **M6: Đối soát (Reconciliation & Settlement)** which encompasses:
- **SM1: Cấu hình đối soát** (Reconciliation Configurations: School Groups, Branches, Services & Tariffs, Calculation Thresholds, Periods)
- **SM2: Phiên đối soát** (Reconciliation Sessions: Lifecycle Draft -> Pending Approval -> Approved -> Sent to School -> Paid / Cancelled / Refunded, Service Breakdown, Snapshot Locked Configuration, Add-on Settlement / Truy thu)

## Design System & UX Baseline
- Design System: `Design System/` (ECO Design System 1.0 Consumer / Enterprise tokens, components, icons, typography, color ramps)
- Legacy Specifications: `docs_legacy/` (`00-master-index.md`, `m6-sm1-cau-hinh-doi-soat.md`, `m6-sm2-phien-doi-soat.md`)
- Legacy Visual Artifacts: 17 pixel-accurate screenshots in `docs_legacy/screenshots/` matching exact UI layouts, tables, modals, drawers, filters, badges, and action menus.

## Active Specs & Features
- Active Spec Workspace: `.agents/specs/032-project-planning-eco-card-portal-module-m6-reconciliation/`
- Documentation Suite: `docs/` (`prd.md`, `tasks.md`, `knowledge.md`, `decisions.md`, `memory.md`, `planning/flows.md`, `planning/screens.md`, `planning/diagrams.md`)
- Research Suite: `docs/research/` (`sources.jsonl`, `evidence.jsonl`, `claims.jsonl`, `contradictions.md`, `research_manifest.json`)

## Session History & Decisions
- `2026-09-23`: Brain initialized via `/init_brain`. Reviewed legacy business rules (BR01-BR11 for SM1; BR01-BR10 for SM2), screen flows, and design system components.
- `2026-09-23`: Planning phase completed via `/planning`. Produced complete 8-document planning suite under `docs/` and 5 deep research ledgers under `docs/research/`. Established ADR-M6-001 (immutable pricing snapshot), ADR-M6-002 (0 VND validation blocker guard), and ADR-M6-003 (hierarchical truy thu modeling). All documentation and spec quality gates passed. Awaiting human oversight review before implementation.
- `2026-09-23`: Development phase completed via `/develop`. Bootstrapped canonical development knowledge ledger (`docs/development/E-001-m6-reconciliation/`) passing `--strict-counts` and substance gates. Built application foundation using React 18, Vite, and TailwindCSS integrated with ECO Design System 1.0 CSS tokens. Implemented domain models, calculation engine (`reconciliationCalculator.js`), state machine lifecycle (`sessionLifecycle.js`), Sub-Module 1 (Cấu hình đối soát) with 4-section group drawer and branch matrix, Sub-Module 2 (Phiên đối soát) with 3-step wizard, 0 VND guard (`MSG-01`), locked snapshot tab (`ADR-M6-001`), and child truy thu sessions (`BR07`). All 7 automated tests passed in 53ms; production bundle built cleanly in 591ms. All execution docs gates passed with exit code 0.
- `2026-09-24`: Implemented Pop-up modal **"Danh sách học sinh"** (`StudentListModal.jsx`) and action dropdown menu (`...`) on branch rows under tab *Chi tiết phí* in `SM2SessionDetail.jsx`. Added `studentDataGenerator.js` matching 100% pixel fidelity to screenshots `media_1790233021836.png` and `media_1790233021842.png` (`Auto_Eco_School` with 20 lượt HS × DV, 2 services per student, pagination, Excel/CSV export, and status badges). Resolved local dev server configuration and verified live interaction via Chrome CDP.
- `2026-09-24`: Implemented dynamic **Ngưỡng thu phí (BR06)** and **Làm tròn ngày dư (BR07)** according to user rules: standard month = 30 days; active days <= minActiveMonths * 30 days (max 30 days when threshold=1) are not charged ("Không tính phí", 0đ, neutral gray badge); active days >= 31 days are charged ("Có tính phí", green badge). Implemented surplus rounding: Student 1 (132 days: 120 + 12 days >= 10 -> 5 months, 5 * 5.000đ = 25.000đ / 5 * 10.000đ = 50.000đ); Student 2 (128 days: 120 + 8 days < 10 -> 4 months, 4 * 5.000đ = 20.000đ / 4 * 10.000đ = 40.000đ); Student 3 (25 days <= 30 days -> 0 months, "Không tính phí", 0đ). Updated `reconciliationCalculator.js`, `studentDataGenerator.js`, `StudentListModal.jsx`, and all 8 unit tests in `reconciliationCalculator.test.js`. Verified live via Chrome CDP.
- `2026-09-25`: Enhanced **Danh sách học sinh & So sánh Log**:
  1. Built **Side-by-Side Audit View** toggled via `[So sánh log]`, with 100% Vietnamese column headers (*Tên học sinh*, *Mã UID*, *Lịch sử hoạt động*, *Tổng số ngày hoạt động*, *Người cập nhật trạng thái*).
  2. Implemented **Discrepancy Audit Data & Explanations**: realistic discrepancy cases with mismatch day badges (`⚠️ Lệch +15 ngày`, `⚠️ Lệch -35 ngày`, `⚠️ Lệch +11 ngày`) and detailed reasonings.
  3. Single-student selection with cross-panel focus & dimming (`opacity-25 blur-[0.6px]`).
  4. Auto-scroll synchronization (`scrollIntoView({ behavior: 'smooth', block: 'center' })` with `left-row-*` and `log-row-*` DOM IDs) so clicking any student immediately brings their exact log entry into view on the right panel.
  5. Clean click-outside handler clearing active focus back to default state.
  6. All 11 unit tests passing, production build passing cleanly.
- `2026-09-30`: Implemented School Group Arrears Policy Configuration, Period Generator & Multi-Sheet Excel Export:
  1. **SM1 Cấu hình đối soát (`SM1ConfigList.jsx`)**: School groups default to collapsed state on view; expand on demand with `[+]` toggle.
  2. **SM1 Cấu hình nhóm trường (`GroupDrawer.jsx`)**:
     - Added **"5. Hình thức truy thu"** allowing configuration between *Option 1: Gồm truy thu ngược đợt sau (`ROLL_FORWARD`)* and *Option 2: Truy thu liền vào tháng tiếp theo (`IMMEDIATE_T1`)*.
     - Section 3 **"Lịch kỳ đối soát & Năm sử dụng dịch vụ"**: added cycle mode selector (*[1] Đối soát theo năm* vs *[2] Đối soát theo kỳ*).
     - When *Đối soát theo năm* is selected, "Số kỳ" is locked/fixed to `1` (disabled from editing) and "Sinh lịch kỳ" generates 1 yearly period.
     - When *Đối soát theo kỳ* is selected, "Số kỳ" is editable with dynamic period generator.
     - Continuous date cascading: editing *Đến ngày* of Kỳ $i$ automatically shifts *Từ ngày* of Kỳ $i+1$ to $endDate + 1\text{ ngày}$ (e.g., `01/03/2027` -> `02/03/2027`).
  3. **SM1 Cập nhật chi nhánh (`BranchDrawer.jsx`)**:
     - Section 2 "Dịch vụ và biểu phí" features two tabs: **"Học phí theo năm"** and **"Học phí theo tháng"**.
     - Default active tab automatically reflects the school group's cycle mode setting (*Đối soát theo năm* $\to$ *Học phí theo năm*; *Đối soát theo kỳ* $\to$ *Học phí theo tháng*).
     - Removed redundant subheader (`Đơn giá / học sinh / tháng (VNĐ)`) on the right of the table title.
     - Updated inline input unit suffixes to **`đ/học sinh/ tháng`** (for periodic/monthly tariffs) and **`đ/học sinh/ năm`** (for yearly tariffs) with appropriate right padding.
     - When viewing the non-configured tab, all redundant pricing cards/inputs are hidden and replaced with a clean warning banner with an action button **"Điều chỉnh ngay"** that directly opens the School Group configuration drawer (`GroupDrawer.jsx`) for instant adjustment.
  4. **SM2 Tạo phiên đối soát (`CreateSessionModal.jsx`)**: Filtered "Hình thức xử lý đối soát & truy thu" dynamically based on the selected school group's configured policy (Option 1 vs Option 2 + "Không truy thu").
  5. **Xuất Excel (2 Sheet) trong Danh sách học sinh (`StudentListModal.jsx`)**: Enhanced "Xuất Excel / CSV" to generate a rich, styled multi-sheet Excel workbook (`.xls`) with *Sheet 1: Danh sách học sinh* and *Sheet 2: Đối chiếu lịch sử trạng thái*.
  6. All 11 unit tests passing, production bundle built cleanly in 926ms. Dev server running on port 5173.
- `2026-10-02`: Implemented Dynamic Email Fields based on Settlement Scope (`GroupDrawer.jsx` & `BranchDrawer.jsx`):
  1. **Cấu hình nhóm trường (`GroupDrawer.jsx`)**:
     - When "Theo nhóm trường" (`SETTLEMENT_SCOPES.GROUP`) is selected, the field "Email nhận biên bản của nhóm (Tối đa 3 email)" is rendered as required.
     - When "Theo từng trường" (`SETTLEMENT_SCOPES.BRANCH`) is selected, the email input field is completely hidden and excluded from validation.
     - When saving a group in GROUP scope, any existing branches automatically have their email list synchronized to the group emails.
  2. **Cập nhật / Thêm chi nhánh (`BranchDrawer.jsx`)**:
     - When the parent school group is configured as "Theo nhóm trường", the "Email nhận biên bản" field is automatically pre-filled with the school group's emails and locked (`disabled={true}`) with a visual sync badge and explanatory helper message.
     - When the parent school group is configured as "Theo từng trường", the "Email nhận biên bản" field is enabled and editable with standard per-branch email validation.
  3. All 11 automated unit tests passed; production build built cleanly in 1.04s. Vite dev server active on `http://localhost:5173/`.
- `2026-10-02 (Feature)`: Implemented Password Delivery & Management for Reconciliation Files (`PasswordDrawer.jsx` & `SM1ConfigList.jsx`):
  1. **Menu thao tác nhóm trường (`SM1ConfigList.jsx`)**: Added "Gửi mật khẩu" action item in the `•••` dropdown menu. Once sent for the first time, it permanently transitions to "Cập nhật mật khẩu".
  2. **Right-Sheet cấu hình mật khẩu (`PasswordDrawer.jsx`)**:
     - Fields: "Add password" (Nhập mật khẩu) & "Confirm password" (Xác nhận mật khẩu), without arbitrary restrictions (users can enter any format), with show/hide eye toggle icons.
     - Live email preview displaying recipient details (`To: [School Email]`, `Cc: edu@finviet.com.vn; phongketoan@finviet.com.vn`), subject `[FINVIET] Mật khẩu file đối soát`, and dynamic password body.
     - Confirmation Modal: Clicking "Gửi" / "Cập nhật & Gửi" opens a modal popup prompting confirmation before dispatching.
- `2026-10-02 (UI Refinements)`: Fixed Action Dropdown Clipping and Password Confirmation Modal Layering:
  1. **Image 1: Menu thao tác nhóm trường (`SM1ConfigList.jsx`)**:
     - Dynamic smart positioning: For lower rows (`idx >= Math.max(1, filteredGroups.length - 2)`), the dropdown menu now opens upwards (`bottom-10 origin-bottom-right`) instead of downwards.
     - Removed `overflow-hidden` from the master table card, set rounded top corners on toolbar, and ensured table container has `min-h-[260px]`.
     - Elevated dropdown menu layer to `z-40` with backdrop `z-30`. Dropdown items ("Thêm chi nhánh", "Chỉnh sửa nhóm", "Gửi mật khẩu") are 100% visible on top layer and never clipped by the table bottom frame.
  2. **Image 2: Pop-up Xác nhận gửi mật khẩu (`PasswordDrawer.jsx`)**:
     - Moved the confirmation modal markup directly inside the "Gửi mật khẩu file đối soát" right sheet container (`relative`).
     - Rendered the modal with `absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6`.
     - Centered the confirmation modal card directly over the right sheet drawer content on the right layer, eliminating the disconnected left-viewport placement and z-index clash.
  3. All 11 unit tests passed in 51ms; production build built cleanly in 1.00s. Dev server active on `http://localhost:5173/`.
- `2026-10-02 (Documentation)`: Formatted and published official Product Requirements Document in Vietnamese (`docs/PRD_Doi_Soat_Module_M6_VI.md`):
  1. Followed 100% of the User PRD Template structure: Header metadata, Business context, Triangular integration architecture (SM1 ↔ Engine ↔ SM2 ↔ Audit), User Stories (Ops, Finance, Auditor), 12 Core Business Rules (BR01-BR12), Functional Requirements (FR-SM1, FR-SM2, FR-AUD), TypeScript Data Contracts, 16 Acceptance Criteria (AC-REC-01 to AC-REC-16), Technical Verification metrics, and Localhost live review links.
