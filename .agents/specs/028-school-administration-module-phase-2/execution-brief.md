# Execution Brief: School Administration Module Phase 2

> Feature ID: `028-school-administration-module-phase-2`
> Task Shape: `Frontend behavior`
> Generated From: `spec.md`, `plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, `agent-routing.md`

## 1. Operator Intent Snapshot

The operator requested comprehensive planning for Module "NHÀ TRƯỜNG" (School Administration) across its next 5 sub-modules: Bảng Thông Tin (Announcements), Bình Chọn (Polls & Surveys), Thực Đơn (Weekly Meal Menus), Điểm Danh NV (Staff Attendance), and Sổ Tay PH (Parent Handbook). This is strictly a planning execution without code generation.

## 2. Required Behavior

- Provide Bảng Thông Tin for multi-channel broadcasting (app/email), scheduling, draft-only editing, preview modal, and bulk deletion with email permanence warnings.
- Provide Bình Chọn for survey formulation, decoupled audience dispatch, live vote progress bars, dynamic pie charts (when votes $> 0$), and student revision history tracking.
- Provide Thực Đơn for 8-week horizon meal planning in grid and file formats, class fallback to school-wide menus, food safety traceability (GTIN/stamps), and asymmetric cloning.
- Provide Điểm Danh NV for rapid single-click staff clock-in, 45-day retroactive edit boundaries, modal absence confirmations, and search-time KPI counter suppression.
- Provide Sổ Tay PH for a strict 2-tier parent handbook category tree with single-sibling accordion expansion, drag-and-drop ordering, rich-text drafting, and cascading deletion protection.

## 3. Scope Boundaries

- In-scope: Sub-modules 6 through 10 of Nhà Trường (Bảng Thông Tin, Bình Chọn, Thực Đơn, Điểm Danh NV, Sổ Tay PH).
- Out-of-scope: Sub-modules 11 through 14 (Góp Ý, Lịch Sự Kiện, Năm Học, Lưu Trữ) which will be planned in Phase 3. Real email SMTP dispatch and hardware biometric clock-in devices are mocked.

## 4. Active Work Slice

- Specifications, Architecture Decisions, Data Models, Flows, Screen Catalogs, Research Ledgers, and Task Breakdowns. Zero application code is generated during this turn.

## 5. Development Ledger Context

- Legacy Specs: `docs_legacy/operating-portal/nha-truong/` (`bang-thong-tin.md`, `binh-chon.md`, `thuc-don.md`, `diem-danh-nv.md`, `so-tay-ph.md`).
- PRD: `docs/prd.md` (Section 4.4, Section 5, AC-029 to AC-033).
- ADR: `docs/decisions.md` (ADR-010).
- Tasks: `docs/tasks.md` (TASK-SCH-006 to TASK-SCH-010).
- Research: `docs/research/` (`sources.jsonl`, `evidence.jsonl`, `claims.jsonl`, `contradictions.md`).

## 6. Verification Path

- `validate_specs.py --feature .agents/specs/028-school-administration-module-phase-2`
- `validate_planning_research.py --root . --strict-outputs`
- `validate_docs_substance.py --root . --strict-planning --require-docs`
- `run_required_docs_gates.py --root . --mode planning`

## 7. Review and Release Signals

- Spec compliance reviewed against operator requirements.
- Architecture challenge completed with zero open ambiguities.
- Ready for operator review and progression to design or implementation upon explicit authorization.

## 7.1 Superpowers Discipline Snapshot

- clarification status: All legacy ambiguities (K009, K010, K011) resolved and documented.
- TDD or accepted exception: Accepted exception for planning mode (zero code generation).
- Root cause status for bugfix work: Form cancellation and search counter anomalies analyzed and addressed.
- Review order: Spec compliance before code quality.
- Completion claim gate: Fresh verification required before success language.

## 8. Context Expansion Rules

### Task Shape Decision
- Task Shape: `Frontend behavior` / `Planning specification`.

### Required Reads
- `spec.md`, `plan.md`, `data-model.md`, `docs/prd.md`, `docs/decisions.md`.

### Forbidden Default Reads
- Backend database migrations, third-party payment gateway internals, non-active sub-modules (11-14).

### Expansion Triggers
- Widening scope to sub-modules 11-14 requires operator provision of respective specifications.
