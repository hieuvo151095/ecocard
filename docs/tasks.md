# Engineering Tasks Breakdown: ECO Card Portal — Module M6 (Đối soát)

This document outlines the sequenced, executable engineering tasks required to rebuild Module M6 (Cấu hình đối soát and Phiên đối soát).

---

### Epic 1: Design Tokens & Layout Infrastructure (Phase 1)

#### TASK-M6-001: Design System Token & Icon Integration
- **Title**: Map ECO Design System 1.0 Tokens, Typography, and SVG Icons into Web Portal
- **Owner**: `benny-frontend-engineer`
- **Write Scope**: `src/styles/tokens.css`, `src/components/common/EcoIcon.jsx`
- **Verification**: Run token compliance validator and inspect rendered SVG glyphs against design system specifications.
- **Docs**: `docs/planning/screens.md`
- **Sync**: Direct integration with existing `Design System/tokens/`
- **Dependencies**: None
- **Details**: Bind color ramps (Primary Blue, Brand Yellow, Inks), typography scales, border radii, and 190+ SVG icon paths.

#### [P] TASK-M6-002: Portal Top Navigation & Shell Layout
- **Title**: Reconstruct Application Header, Navigation Tabs, and Breadcrumbs
- **Owner**: `benny-frontend-engineer`
- **Write Scope**: `src/components/layout/Header.jsx`, `src/components/layout/SubNav.jsx`
- **Verification**: Visual match comparison against `docs_legacy/screenshots/sm1-cau-hinh-doi-soat-danh-sach.png`.
- **Docs**: `docs/planning/screens.md`
- **Sync**: Consumes `Design System/assets/icons/icon-data.js`
- **Dependencies**: TASK-M6-001
- **Details**: Implement brand blue top banner, module tabs with active state, Lê Thuận user profile, and sub-navigation links.

---

### Epic 2: Data Models, Storage & Mock Engine (Phase 2)

#### TASK-M6-003: Core Domain Models & In-Memory Storage Engine
- **Title**: Implement Domain Entities, Pricing Snapshot Store, and State Engine
- **Owner**: `david-systems-architect`
- **Write Scope**: `src/data/models.js`, `src/context/PortalContext.jsx`, `src/data/seedData.js`
- **Verification**: Automated unit tests exercising state transitions and immutable snapshot generation.
- **Docs**: `docs/planning/diagrams.md`
- **Sync**: Aligned with database schema definitions in `docs/planning/diagrams.md`
- **Dependencies**: TASK-M6-001
- **Details**: Build entities for SchoolGroup, SchoolBranch, PeriodSchedule, ServiceTariff, and ReconciliationSession with localStorage persistence.

#### [P] TASK-M6-004: Student Scanning & Fee Calculation Simulator
- **Title**: Implement Student Active Month Calculation Engine with 0 VND Guard
- **Owner**: `alan-tech-lead`
- **Write Scope**: `src/services/reconciliationCalculator.js`
- **Verification**: Unit tests covering threshold rules, surplus day rounding, multi-service summation, and 0 VND error triggering.
- **Docs**: `docs/prd.md`
- **Sync**: Implements business rules BR06, BR07, and MSG-01
- **Dependencies**: TASK-M6-003
- **Details**: Calculate active months from attendance dates, apply rounding rules, multiply by service unit prices, and flag zero-fee branches.

---

### Epic 3: Sub-Module 1 — Cấu hình đối soát (Phase 3)

#### TASK-M6-005: School Group Data Table & Expandable Branch View
- **Title**: Build SM1 Master List with Filters, Status Switches, and Nested Branches
- **Owner**: `benny-frontend-engineer`
- **Write Scope**: `src/pages/SM1ConfigList.jsx`, `src/components/sm1/BranchSubTable.jsx`
- **Verification**: Verify table filtering, search query matching, row expansion toggle, and status switch dispatch.
- **Docs**: `docs/planning/screens.md`
- **Sync**: Consumes `PortalContext.jsx` state actions
- **Dependencies**: TASK-M6-003
- **Details**: Construct master table matching screenshot with pill tags, date range format, purple threshold badges, and action dropdown.

#### [P] TASK-M6-006: School Group Creation & Edit Drawer
- **Title**: Implement Slide-Over Drawer for School Group Onboarding and Period Schedule Generator
- **Owner**: `benny-frontend-engineer`
- **Write Scope**: `src/components/sm1/GroupDrawer.jsx`
- **Verification**: Complete form validation tests, schedule generation calculation, and group persistence.
- **Docs**: `docs/planning/screens.md`
- **Sync**: Enforces business rules BR01-BR05
- **Dependencies**: TASK-M6-003
- **Details**: Implement 4 numbered sections: Legal Entity, Settlement Scope (radio cards), Schedule Generator (`Sinh lịch kỳ`), and Threshold Rules.

#### [P] TASK-M6-007: School Branch Assignment & Tariff Matrix Drawer
- **Title**: Build Branch Configuration Drawer with Service Checkboxes and Per-Period Pricing
- **Owner**: `benny-frontend-engineer`
- **Write Scope**: `src/components/sm1/BranchDrawer.jsx`
- **Verification**: Test adding branches, updating service checkboxes, entering period prices with currency format, and saving.
- **Docs**: `docs/planning/screens.md`
- **Sync**: Enforces business rules BR08-BR10
- **Dependencies**: TASK-M6-006
- **Details**: Render contextual header badge, branch details, service selector cards, and dynamic period pricing matrix.

---

### Epic 4: Sub-Module 2 — Phiên đối soát (Phase 4)

#### TASK-M6-008: Reconciliation Session Master Table & KPI Metrics Bar
- **Title**: Implement SM2 Session Master List, State Badges, and Summary KPI Counters
- **Owner**: `benny-frontend-engineer`
- **Write Scope**: `src/pages/SM2SessionList.jsx`, `src/components/sm2/MetricsBar.jsx`
- **Verification**: Verify filter rows (code, group, school, status, dates), KPI counters tally, and nested truy thu display.
- **Docs**: `docs/planning/screens.md`
- **Sync**: Consumes `PortalContext.jsx` session states
- **Dependencies**: TASK-M6-003
- **Details**: Render multi-line filter bar, metrics counter badges, session rows, status pill tags, and contextual action menus.

#### TASK-M6-009: Multi-Step Session Creation Wizard Modal
- **Title**: Build 3-Step Session Creation Wizard with Live Scan Preview and 0 VND Blocker
- **Owner**: `benny-frontend-engineer`
- **Write Scope**: `src/components/sm2/CreateSessionModal.jsx`
- **Verification**: Verify step navigation, branch checklist for individual scope, period dropdown, scan trigger, and error blocking.
- **Docs**: `docs/planning/flows.md`
- **Sync**: Implements business rules BR01-BR03 and MSG-01
- **Dependencies**: TASK-M6-004, TASK-M6-008
- **Details**: Step 1 Group/Branch selection, Step 2 Period selection, Step 3 Live calculation preview with amber alert blocking on 0 VND.

#### TASK-M6-010: Session Detail View, Service Breakdown & Locked Config Snapshot
- **Title**: Reconstruct Session Detail View with Tabs, Master Metadata, and Lifecycle Actions
- **Owner**: `benny-frontend-engineer`
- **Write Scope**: `src/pages/SM2SessionDetail.jsx`, `src/components/sm2/LockedConfigTab.jsx`
- **Verification**: Inspect master card, 4 KPI cards, expandable service breakdown rows, and immutable locked snapshot tab.
- **Docs**: `docs/planning/screens.md`
- **Sync**: Verifies snapshot immutability requirement BR04
- **Dependencies**: TASK-M6-009
- **Details**: Render copyable session code, KPI cards, Chi tiết phí sub-table, Cấu hình đã khóa view, and state-driven action bar.

#### TASK-M6-011: Lifecycle State Machine Transitions & Arrears (Truy thu) Engine
- **Title**: Connect Operational Transitions and Nested Truy Thu Child Session Creation
- **Owner**: `alan-tech-lead`
- **Write Scope**: `src/services/sessionLifecycle.js`, `src/components/sm2/TruyThuModal.jsx`
- **Verification**: Walkthrough full lifecycle from Draft to Approval, Transmission, Paid, and Truy Thu generation.
- **Docs**: `docs/planning/flows.md`
- **Sync**: Enforces business rules BR06-BR08
- **Dependencies**: TASK-M6-010
- **Details**: Implement Gửi duyệt, Duyệt phiên, Từ chối, Hủy phiên, Gửi biên bản, Xác nhận thanh toán, and Tạo phiên truy thu.

---

### Epic 5: Verification, Design Audit & Documentation Closeout (Phase 5)

#### TASK-M6-012: Pixel-Accuracy Design Audit & Cross-Browser Verification
- **Title**: Conduct Visual Audit Against 17 Screenshots and Run Mandatory Docs Gates
- **Owner**: `ada-qa-agent`
- **Write Scope**: `docs/verification.md`, `docs/memory.md`
- **Verification**: Run `run_required_docs_gates.py` and inspect side-by-side visual parity.
- **Docs**: `docs/verification.md`
- **Sync**: Validates compliance with Marcus Fleet Constitution Article IV
- **Dependencies**: TASK-M6-011
- **Details**: Perform automated and manual audits across all 17 screenshot flows, recording verification evidence and residual risks.
