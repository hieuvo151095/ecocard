# Execution Brief: School Administration Module Phase 3

> Feature ID: `029-school-administration-module-phase-3`  
> Task Shape: `Frontend behavior`  
> Generated From: `spec.md`, `plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, `agent-routing.md`  

---

## 1. Operator Intent Snapshot

The operator requested comprehensive planning for Module "NHÀ TRƯỜNG" (School Administration) across its final 4 sub-modules: Góp Ý (Parent Feedback & Inquiries), Lịch Sự Kiện (Event & Holiday Calendar), Năm Học (Academic Years & Terms), and Lưu Trữ (Archived Students Roster). This is strictly a planning execution without code generation.

## 2. Required Behavior

- Provide Góp Ý for feedback ticket triage, 8 functional categories, 4 status cards with independent counter retention, inline priority editing, handler assignment, and 2-way discussion threads.
- Provide Lịch Sự Kiện for 3-view event calendar (Year, Month, Event list with tear-away date cards), semantic category color coding, single-day event end-date auto-fill, and multi-year range navigation.
- Provide Năm Học for minimal 3-field academic year configuration, automated system-date current badge derivation, non-overlapping term validation, and cross-module filter feeding.
- Provide Lưu Trữ for student archive repository with withdrawal audit context, warning banners, class continuity restoration, and two-step permanent deletion confirmation.

## 3. Scope Boundaries

- In-scope: Sub-modules 11 through 14 of Nhà Trường (Góp Ý, Lịch Sự Kiện, Năm Học, Lưu Trữ).
- Out-of-scope: Direct ticket submission by administrators on the web portal (tickets originate on parent mobile app), external calendar synchronization (Google/Outlook), and automated recurring event rules.

## 4. Active Work Slice

- Specifications, Architecture Decisions, Data Models, Flows, Screen Catalogs, Research Ledgers, and Task Breakdowns. Zero application code is generated during this turn.

## 5. Development Ledger Context

- Legacy Specs: `docs_legacy/operating-portal/nha-truong/` (`gop-y.md`, `lich-su-kien.md`, `nam-hoc.md`, `luu-tru.md`).
- PRD: `docs/prd.md` (Section 4.6, Section 5, AC-034 to AC-040).
- ADR: `docs/decisions.md` (ADR-011).
- Tasks: `docs/tasks.md` (TASK-SCH-011 to TASK-SCH-015).
- Research: `docs/research/` (`sources.jsonl`, `evidence.jsonl`, `claims.jsonl`, `contradictions.md`).

## 6. Verification Path

- `validate_specs.py --feature .agents/specs/029-school-administration-module-phase-3`
- `validate_planning_research.py --root . --strict-outputs`
- `validate_docs_substance.py --root . --strict-planning --require-docs`
- `run_required_docs_gates.py --root . --mode planning`

## 7. Review and Release Signals

- Spec compliance reviewed against operator requirements.
- Architecture challenge completed with zero open ambiguities.
- Ready for operator review and progression to design or implementation upon explicit authorization.

### Superpowers Discipline Snapshot

- clarification status: All legacy ambiguities (K012, K013, K014, K015) resolved and documented.
- TDD or accepted exception: Accepted exception for planning mode (zero code generation).
- Root cause status for bugfix work: Status card counter drop anomaly and event date picking fatigue analyzed and addressed.
- Review order: Spec compliance before code quality.
- Completion claim gate: Fresh verification required before success language.

## 8. Context Expansion Rules

### Task Shape Decision
- Task Shape: `Frontend behavior` / `Planning specification`.

### Required Reads
- `spec.md`, `plan.md`, `data-model.md`, `docs/prd.md`, `docs/decisions.md`.

### Forbidden Default Reads
- Backend database migrations, third-party payment gateway internals, previous completed phases already approved.

### Expansion Triggers
- Any change to student master status transitions requires cross-checking `docs_legacy/operating-portal/nha-truong/hoc-sinh.md`.
