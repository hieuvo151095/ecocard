# Execution Brief: Feature Specification: ECO Card Portal Module M6 (Đối soát)

> Feature ID: `032-project-planning-eco-card-portal-module-m6-reconciliation`
> Task Shape: `frontend-behavior`
> Generated From: `spec.md`, `plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, `agent-routing.md`

## 1. Operator Intent Snapshot

## 1. Purpose
The purpose of this feature is to rebuild Module M6 (Đối soát) of the ECO Card Portal, encompassing Sub-Module 1 (Cấu hình đối soát) and Sub-Module 2 (Phiên đối soát). The system automates periodic billing calculations, enforces immutable configuration snapshotting at session creation, prevents zero-fee billing sessions, and coordinates the full lifecycle from draft creation to managerial approval, school notification, and retroactive arrears settlement.


## 2. Required Behavior

## 3. Functional Requirements
- `FR-001`: School Group management with unique immutable group code, legal entity fields, settlement scope (Theo nhóm trường or Theo từng trường), and up to 3 recipient emails.
- `FR-002`: Multi-period billing calendar engine supporting automated schedule generation (Sinh lịch kỳ) and individual period fee collection toggling.
- `FR-003`: Calculation threshold configuration specifying minimum active student months and surplus day rounding rules.
- `FR-004`: School branch assignment with enrolled student count, 4 service toggles (Phần mềm quản lý, Camera AI, Thẻ học sinh, Căn tin), and per-period unit prices.
- `FR-005`: 3-step session creation wizard (Select Group/Branches -> Select Period & Cut-Off Date -> Student Scan Preview).
- `FR-006`: Zero-fee blocker guard preventing session creation if any selected branch has a calculated fee of 0 VND (MSG-01).
- `FR-007`: Immutable configuration snapshotting locking pricing rules into the session entity upon creation.
- `FR-008`: Complete lifecycle state machine (Nháp -> Chờ duyệt -> Đã duyệt -> Đã gửi trường -> Đã thanh toán, with Hủy phiên allowed in Nháp).
- `FR-009`: Nested child retroactive settlement sessions (Phiên truy thu) launched from paid parent sessions.


## 5. Acceptance Criteria
- `AC-001`: Creating a school group successfully establishes periods and active thresholds, displaying in the master list.
- `AC-002`: Expanding a school group row renders the nested branches table with active service indicators and edit actions.
- `AC-003`: Step 3 of session creation blocks submission with an amber alert if any branch calculates to 0 VND.
- `AC-004`: Created sessions lock a frozen snapshot tab displaying effective tariffs independent of future SM1 edits.
- `AC-005`: Sessions advance through lifecycle states with contextual action button updates.
- `AC-006`: Paid sessions allow launching nested child truy thu sessions displayed under the parent row.


## 3. Scope Boundaries

## 7. Constraints
- Strict preservation of design system visual tokens, component shapes, and 190+ SVG icon glyphs.
- Zero code generation during planning phase.
- Immutable data retention: financial records must not be deleted.
- Out of scope boundaries: direct core banking API settlement integration and automated card tap attendance ingest are handled upstream.


## 4. Active Work Slice

## 1. Technical Summary
This plan outlines the architecture, component hierarchy, state flow, and verification methods to rebuild Module M6 (Đối soát). The implementation leverages React 18, TailwindCSS customized with ECO Design System 1.0 CSS tokens, a reactive Context state store with localStorage persistence, and mathematical simulation engines for active student calculations and locked configuration snapshots.


## 6. Agent Routing
- UI Layout & Screens: `benny-frontend-engineer`
- Domain Models & State Store: `david-systems-architect`
- Calculation & Lifecycle Engine: `alan-tech-lead`
- Quality Assurance & Visual Audit: `ada-qa-agent`


## Tasks

Missing from tasks.md.


## 4.1 Dynamic Execution Signals

### Changed Files

- No changed files were provided for this brief rebuild.

### Failing Evidence

- No failing evidence was provided for this brief rebuild.

## Execution Monitoring

- Daily sync on state store contracts and snapshot schema consistency.
- Real-time lint and token compliance validation on component additions.
- Automated gate checks executed upon completion of each phase.

---


## 5. Development Ledger Context

Read these development-ledger notes before source edits for the active slice:

No `docs/development/` notes matched this feature workspace.
Before behavior-changing code work, create or reconcile the development ledger for this feature slice.
Preferred paths:
- If the feature is new: run `python3 .agents/scripts/create_development_docs.py --name "<epic-or-feature-name>" --feature-id "<feature-id>" --epic-number 001 --child-number 001 --task-number 001`.
- If the project is brownfield or docs are stale: route to `/doc_reconcile` and repair the ledger before source edits.

## 6. Verification Path

## Verification Plan

### Command or Procedure
Automated test suite and validation scripts verify requirements, calculations, and contracts:

```bash
# 1. Run mandatory documentation and research gates
python3 .agents/scripts/run_required_docs_gates.py --root . --mode planning

# 2. Run spec validation
python3 .agents/scripts/validate_specs.py --feature .agents/specs/032-project-planning-eco-card-portal-module-m6-reconciliation

# 3. Automated calculation engine verification
npm test -- src/services/reconciliationCalculator.test.js
```

Manual and Visual Procedures:
- Step-by-step walkthrough of Group onboarding drawer and schedule generator.
- Step-by-step walkthrough of Branch configuration drawer with 4 service cards.
- Verification of SM2 3-step wizard with live student scanning simulation.
- Comparison of Session Detail tabs (Chi tiết phí and Cấu hình đã khóa) against screenshots.
- Creation of nested child retroactive settlement session (Truy thu).


## Execution Gates
- Gate 1: All research artifacts in `docs/research/` pass validation gates (`sources.jsonl`, `evidence.jsonl`, `claims.jsonl`, `contradictions.md`, `research_manifest.json`).
- Gate 2: All 8 core documentation files under `docs/` pass substance, structure, and word count gates without template markers.
- Gate 3: Spec suite passes validation via `validate_specs.py`.
- Gate 4: Zero code generation occurs before human planning approval.

### Evidence-before-claim Gate

NO COMPLETION CLAIMS are allowed until the exact command or manual procedure was run fresh, the output was inspected, and the result was recorded below. Do not infer success from partial checks, previous sessions, or agent reports.


## Local Preconditions

- Required services: Node.js runtime (v18+) and browser environment.
- Required environment variables: None (uses client-side mock store with local storage persistence).
- Required commands: `npm run dev` to launch portal preview.


## Validation Path

1. Run:
   ```bash
   python3 .agents/scripts/run_required_docs_gates.py --root . --mode planning
   ```
2. Confirm:
   ```text
   REQUIRED DOCS GATES PASSED
   ```


## POC Rehearsal

- Smallest end-to-end path to demonstrate:
  - Load SM1 master list, expand school branch rows, open create group drawer.
  - Load SM2 session wizard, trigger live student calculation preview, and verify the 0 VND guard alert.
- Evidence to capture during rehearsal:
  - Console verification logs of calculation engine and snapshot serialization.
  - Side-by-side screenshot comparisons against `docs_legacy/screenshots/`.
- Criteria to stop and revise docs before broader execution:
  - Any mismatch in financial formula calculation or missing design tokens.


## 7. Review and Release Signals

## 10. Review Loop
- `R-001`: Product Review Round completed by sophia-product-manager, aligning stories and functional requirements with legacy documentation.
- `R-002`: Architecture Review Round completed by david-systems-architect, validating snapshot immutability, data schemas, and lifecycle state machines.
- `R-003`: Quality Review Round completed by ada-qa-agent, establishing testable acceptance criteria and evidence ledgers.


## Review Loop Tasks

- [ ] `T008`: Spec and product alignment review round by sophia-product-manager.
  - Owner: sophia-product-manager
  - Write Scope: spec.md
  - Verification: Confirm all user stories and acceptance criteria trace to legacy documentation.
  - Docs: spec.md
  - Sync: Milestone review round 1
- [ ] `T009`: Technical architecture and contracts challenge review by david-systems-architect.
  - Owner: david-systems-architect
  - Write Scope: plan.md, contracts/
  - Verification: Confirm snapshot immutability, data models, and state diagrams are sound.
  - Docs: plan.md
  - Sync: Milestone review round 2
- [ ] `T010`: Final QA verification and acceptance sign-off by ada-qa-agent.
  - Owner: ada-qa-agent
  - Write Scope: verification.md
  - Verification: Confirm all tests pass, gates are satisfied, and recommendation is recorded.
  - Docs: verification.md
  - Sync: Milestone review round 3


## Review Rounds
- Scope & Product Review: Conducted by sophia-product-manager, verifying complete alignment with legacy business specifications.
- Architecture & Contracts Review: Conducted by david-systems-architect, validating entity boundaries, immutability, and state flow.
- Quality Assurance Review: Conducted by ada-qa-agent, confirming comprehensive acceptance criteria and verification readiness.


## Release Recommendation
Recommendation: GO FOR PLANNING APPROVAL. The specification package, research ledgers, architectural contracts, and task breakdowns are complete, substantiated, and validated. Ready for operator review before transitioning to implementation.


## 7.1 Superpowers Discipline Snapshot

- clarification status: read `spec.md#6. Clarifications` before planning or widening scope.
- TDD or accepted exception: behavior-changing tasks must name RED-GREEN-REFACTOR or an explicit accepted exception.
- Root cause status for bugfix work: reproduce and identify cause before mutation.
- Review order: spec compliance before code quality.
- Completion claim gate: fresh verification required before success language.

## 8. Context Expansion Rules

### Task Shape Decision

- Selected task shape: `frontend-behavior`
- Why this shape: Read page, feature, hook, and browser-interaction artifacts first.

### Required Reads

- Required read: `agents.md`
- Required read: `.agents/memory/constitution.md`
- Required read: `.agents/specs/032-project-planning-eco-card-portal-module-m6-reconciliation/execution-brief.md`
- Required read: `.agents/specs/032-project-planning-eco-card-portal-module-m6-reconciliation/spec.md` only if the brief or failing evidence says deeper requirement context is needed.
- Required read: `.agents/specs/032-project-planning-eco-card-portal-module-m6-reconciliation/plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, and `agent-routing.md` only when the current write scope or failing evidence requires the deeper artifact.
- Required read: create or reconcile the missing `docs/development/` notes before behavior-changing source edits.

### Forbidden Default Reads

- Forbidden by default: schema and migration files
- Forbidden by default: analytics stacks
- Forbidden by default: cloud orchestration
- Forbidden by default: unrelated persistence layers

### Expansion Triggers

- Read page, feature, hook, and browser-interaction artifacts first.
- Do not widen into data-contract or infrastructure context without failing evidence.
- Load frontend, technical lead, and QA skills unless the spec explicitly says otherwise.
- Read the `docs/development/` notes listed in this brief before widening beyond the current work slice.
- If the required epic/feature/module/page/task note is missing, stop and reconcile the development ledger instead of improvising from code alone.

## Review Topology

| Review Stage | Primary Reviewer | Input Artifact | Output Artifact |
| --- | --- | --- | --- |
| Spec challenge | `aurora-plan-challenger` | `spec.md` | updated `spec.md` or findings |
| Plan challenge | `alan-tech-lead` | `plan.md` | updated `plan.md` or findings |
| Verification sign-off | `ada-qa-agent` | `verification.md` | evidence-backed recommendation |


## Escalation Rules

- Escalate when documentation prerequisites are missing or misleading.
- Escalate when verification fails repeatedly without new evidence.
- Escalate when write scope conflicts with another agent's ownership.
