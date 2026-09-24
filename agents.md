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
- `2026-09-24`: Re-architected right-sheet **"Thêm chi nhánh"** (`BranchDrawer.jsx`) matching 100% pixel fidelity to user's expected design (`media_1790233181304.png` and `media_1790233290420.png`). Added `masterData.js` with Finviet Master School directory (`{mã trường} · {tên trường}`), searchable dropdown with search icon/chevron toggle, instant validation guards (`Vui lòng chọn chi nhánh.`), contract date pickers, service checkbox toggles, dynamic tariff period inputs with thousands formatting (`10.000 đ`), and locked state for editing mode. Verified live via Chrome CDP screenshots.

