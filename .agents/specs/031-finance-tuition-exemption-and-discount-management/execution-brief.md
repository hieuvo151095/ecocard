# Execution Brief: Feature Specification: Tuition Exemption & Discount Policy Management (Tài Chính — Miễn Giảm)

> Feature ID: `031-finance-tuition-exemption-and-discount-management`
> Task Shape: `frontend-behavior`
> Generated From: `spec.md`, `plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, `agent-routing.md`

## 1. Operator Intent Snapshot

## 1. Purpose

The **Tuition Exemption & Discount Policy Management** sub-module ("Tài Chính — Miễn Giảm", entry point `/school/discount`) establishes an institutional policy catalog and automated deduction engine for the School Operating Portal. It allows School Administrators and Accountants to formulate, schedule, and audit tuition fee exemptions, social policy concessions, merit scholarships, sibling discounts, and promotional fee waivers for classes and individual learners.

This feature delivers operational integrity and automated billing workflows:
1. **Discount Policy Catalog Roster (`/school/discount`):** Complete policy inventory with policy code, policy name, applied fee item, calculation type (% or fixed VND), beneficiary scope summary, validity interval, and lifecycle status.
2. **Dual Calculation Types:** Percentage rate discount (`percent`, 1% to 100%) or fixed cash reduction (`fixed_amount` in integer VND), bound to a specific fee line item from the master fee catalog (`/school/school-fees`).
3. **Dual Application Scope Topology:** Class-wide cohort targeting (`class` with multi-choice selection of classes) or individual learner targeting (`student` with searchable cross-class student picker).
4. **Temporal State Machine & Lifecycle Transitions (Resolution K017):** Automatic transition to `Hết hạn` (Expired) when the configured validity interval (`academic_year` or `fromMonth` to `toMonth`) lapses past the current date, alongside manual pause (`Ngừng áp dụng`) and reactivation controls.
5. **Conflict Resolution & Highest Priority Engine (Resolution K016):** Automatic resolution of overlapping policies for the same fee item via Scope Specificity (student overrides class) and Highest Rate Priority (`Math.max`), with disjoint fee item independence and non-negative line-item clamping.
6. **Invoicing Creation Wizard Integration & Admin Override Toggle (Resolution K018):** Automatic deduction injection during tuition invoice generation (`/school/fee/create`) with an administrative toggle ("Tự động áp dụng chính sách miễn giảm", default ON) permitting batch gross billing without mutating catalog policies.
7. **Beneficiary Roster & Excel Export Pipeline:** Comprehensive `.xlsx` export of discount policies and expanded student beneficiary rosters with audit timestamps.

---


## 2. Required Behavior

## 3. Functional Requirements

- `FR-001`: The system MUST provide a discount policy catalog (`/school/discount`) displaying policy code, policy name, applied fee item, calculation type, discount value, scope summary, validity interval, and lifecycle status.
- `FR-002`: The system MUST support two discount calculation types: Percentage discount (`percent`, 1% to 100%) and Fixed cash deduction (`fixed_amount` in integer VND), strictly bound to a fee line item from the master fee catalog.
- `FR-003`: The system MUST support dual application scope topologies: Class cohort (`class` with multi-select class dropdown) or Specific individual students (`student` with searchable student picker modal across classes).
- `FR-004`: The system MUST enforce temporal validity by Academic Year or Month Interval (`fromMonth` to `toMonth`), automatically transitioning lapsed policies to `Hết hạn` (Expired) while enabling manual pause (`Ngừng áp dụng`) and reactivation controls.
- `FR-005`: The system MUST enforce highest discount priority and scope specificity conflict resolution when multiple policies target the same student and fee line item, while keeping distinct fee item discounts independent and clamping line-item totals to non-negative balances.
- `FR-006`: During tuition invoice generation (`/school/fee/create`), the billing engine MUST automatically evaluate active policies and render itemized discount deductions on invoices.
- `FR-007`: The invoice creation wizard MUST provide an administrative toggle ("Tự động áp dụng chính sách miễn giảm", default ON) allowing accountants to optionally bypass discount calculations for a specific batch generation run without mutating master policy definitions.
- `FR-008`: The system MUST provide an Excel export capability downloading all discount policies and expanded beneficiary rosters to an `.xlsx` file.

---


## 5. Acceptance Criteria

- `AC-001`: Policy Catalog Roster & Automated Expiration:
  1. Navigating to `/school/discount` displays the policy roster table with columns: Mã chính sách, Tên chính sách, Khoản thu, Mức miễn giảm, Nhóm áp dụng, Thời gian, Trạng thái, and Thao tác (`•••`).
  2. Policies whose validity end date strictly precedes current system date automatically display the `Hết hạn` status badge.
  3. Clicking "Ngừng áp dụng" transitions active policy to paused state; clicking "Kích hoạt lại" restores it if within its validity interval.
- `AC-002`: Policy Creation & Dual Scope Configuration:
  1. Policy creation form validates that Policy Name has $\ge 3$ characters, Fee Item is selected from fee catalog, Discount Type is valid, and Reason is provided.
  2. When Scope is `class`, multi-select class dropdown allows selecting 1 or more classes (or "Tất cả các lớp").
  3. When Scope is `student`, searchable student picker modal enables selecting 1 or more students across enrolled classes.
- `AC-003`: Conflict Resolution & Line-Item Independence:
  1. When a student matches multiple policies for the same fee item, the engine selects the highest rate (`Math.max`), and student-specific policy takes precedence over class-wide policy.
  2. Deductions for distinct fee items (e.g., Tuition vs Meal fees) apply independently.
  3. Deduction for any line item is capped at gross item price, ensuring net payable is never negative.
- `AC-004`: Invoice Creation Wizard Integration & Override Toggle:
  1. In `/school/fee/create`, Step 1 renders the toggle switch "Tự động áp dụng chính sách miễn giảm" (default ON).
  2. When ON, Step 2 preview displays itemized discount deduction lines (`Miễn giảm: {Tên} (-X đ)`).
  3. When OFF, preview displays gross fee catalog amounts without deductions, leaving master policies unchanged.
- `AC-005`: Historical Invoice Immutability & Excel Export:
  1. Changing or expiring a policy does not alter previously issued or settled invoices.
  2. Clicking "Xuất Excel" downloads an `.xlsx` workbook containing policy definitions and beneficiary rosters.

---


## 3. Scope Boundaries

## 7. Constraints

- Zero unapproved color hexes outside the ECO Design System 1.0 palette.
- Standard full-width frame layout (`w-full space-y-6`) inside `PortalLayout` without artificial container constraints or double padding.
- Strict sentence-case table headers and Vietnamese financial terminology (Miễn giảm, Học phí, Tiền ăn, Xe đưa đón).

---


## 4. Active Work Slice

## 1. Technical Summary

This plan details the implementation architecture for the **Tuition Exemption & Discount Policy Management** sub-module (`/school/discount`). The module introduces a Redux-governed discount policy store, a dedicated business rule engine enforcing highest priority and scope specificity, seamless integration with the tuition invoice creation wizard (`/school/fee/create`), and an Excel export pipeline. All arithmetic operations operate in integer VND dot-separated notation, guaranteeing non-negative net payable balances and historical invoice immutability.

---


## 6. Agent Routing

Ownership and responsibilities across the feature development lifecycle:

| Workstream | Primary Agent | Output | Verification |
| --- | --- | --- | --- |
| Architecture & Contracts | `alan-tech-lead` | `src/types/discount.ts`, `discountValidation.ts` | Typecheck and validation unit tests |
| UI & State Implementation | `benny-frontend-engineer` | `discountSlice.ts`, UI Components, Pages | Interactive UI rendering and Redux actions |
| Invoicing Integration | `benny-frontend-engineer` | Wizard toggle, Line-item injection | Invoice creation test cases |
| Verification & Quality Gates | `ada-qa-agent` | `tests/unit/discount.test.mjs`, Quality Reports | 100% test pass rate across all suites |

---


## Tasks

- [ ] `T001` Owner: `alan-tech-lead` Write Scope: `src/types/discount.ts`, `src/utils/discountValidation.ts`. Verification: Run unit test assertions for conflict resolution, specificity precedence, and clamping. Docs: `spec.md`, `data-model.md`. Sync: Update TypeScript types and validation contracts.
- [ ] `T002` Owner: `benny-frontend-engineer` Write Scope: `src/store/slices/discountSlice.ts`, `src/modules/finance/discount/`. Verification: Verify Redux state transitions (create, edit, pause, resume, delete) and filter actions. Docs: `plan.md`, `tasks.md`. Sync: Register discount slice in root store.
- [ ] `T003` Owner: `benny-frontend-engineer` Write Scope: `src/pages/[schoolCode]/school/discount/`, `src/modules/finance/discount/CreateDiscountPolicyModal.tsx`, `StudentPickerModal.tsx`. Verification: Verify UI layout, dual scope selectors, and form submission validation. Docs: `quickstart.md`. Sync: Update navigation links and layout hierarchy.
- [ ] `T004` Owner: `benny-frontend-engineer` Write Scope: `src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`, `src/store/slices/invoiceSlice.ts`. Verification: Verify automatic discount deduction injection and administrative override toggle. Docs: `spec.md`, `plan.md`. Sync: Keep historical invoice records immutable.
- [ ] `T005` Owner: `benny-frontend-engineer` Write Scope: `src/modules/finance/discount/discountExport.ts`. Verification: Validate Excel workbook generation and beneficiary roster formatting. Docs: `verification.md`. Sync: Export metadata headers and UTF-8 diacritics.
- [ ] `T006` Owner: `ada-qa-agent` Write Scope: `tests/unit/discount.test.mjs`, `verification.md`. Verification: Execute full test suite `npm test` and verify zero regressions. Docs: `verification.md`. Sync: Append test execution logs and release recommendation.

---


## 4.1 Dynamic Execution Signals

### Changed Files

- No changed files were provided for this brief rebuild.

### Failing Evidence

- No failing evidence was provided for this brief rebuild.

## Execution Monitoring

- Required pre-code gates: Specification approval, data contracts definition, and ADR-012 registration.
- Mid-slice checkpoints: Validate calculation engine tests passing 100% before mounting UI components.
- Circuit breaker after repeated failure: Halt implementation if discount calculation produces negative balances or regresses existing invoice generation.
- Human escalation trigger: Escalate to Tech Lead if discount priority rules conflict with school accounting requirements.

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

| Requirement | Method | Command or Procedure | Expected Result |
| --- | --- | --- | --- |
| `FR-001` | Automated Test | `node tests/unit/discount.test.mjs` | Roster table renders with status badges and filters |
| `FR-002` | Unit Test | `node tests/unit/discount.test.mjs` | Calculates percentage and fixed VND deductions accurately |
| `FR-003` | Unit Test | `node tests/unit/discount.test.mjs` | Resolves class and individual student beneficiary scopes |
| `FR-004` | Unit Test | `node tests/unit/discount.test.mjs` | Automatically transitions lapsed policies to Expired status |
| `FR-005` | Unit Test | `node tests/unit/discount.test.mjs` | Highest priority and specificity override applied correctly |
| `FR-006` | Integration Test | `node tests/unit/discount.test.mjs` | Invoices render itemized discount deduction lines |
| `FR-007` | Integration Test | `node tests/unit/discount.test.mjs` | Wizard toggle bypasses discounts without altering catalog |
| `FR-008` | Export Check | `node tests/unit/discount.test.mjs` | Excel export payload structured with beneficiary metadata |

---


## Execution Gates

- Pre-implementation gates passed: Specification approved, research verified, and ADR-012 documented.
- Plan and contract readiness confirmed: TypeScript models and validation contracts defined.
- Documentation targets created or reconciled: PRD, Tasks, Knowledge, Decisions, Memory, and Flows synchronized.
- Required human approvals: Explicit operator authorization required before writing implementation code.

### Evidence-before-claim Gate

NO COMPLETION CLAIMS are allowed until the exact command or manual procedure was run fresh, the output was inspected, and the result was recorded below.

---


## Local Preconditions

- Node.js runtime environment installed (version 18 or higher).
- Next.js development server running locally or operable via `npm run build`.
- Local port 3000 available for serving the portal interface.
- Python 3 environment with `.agents/scripts/` test harnesses available.

---


## Validation Path

1. Execute the automated unit test suite verifying discount calculations and validation logic:
   ```bash
   node tests/unit/discount.test.mjs
   ```
2. Verify zero regressions across all operational, academic, and financial modules:
   ```bash
   npm test
   ```
3. Run the Next.js production build verification:
   ```bash
   npm run build
   ```
4. Verify planning and specification documentation compliance gates:
   ```bash
   python3 .agents/scripts/validate_specs.py --feature .agents/specs/031-finance-tuition-exemption-and-discount-management/
   python3 .agents/scripts/run_required_docs_gates.py --root . --mode planning
   ```

---


## POC Rehearsal

- Smallest end-to-end path to demonstrate:
  1. Open `/school/discount`, click "+ Thêm chính sách miễn giảm", configure a 20% discount on "Học phí" for class 10A1.
  2. Open `/school/fee/create`, start invoice generation for 10A1 with the discount toggle ON, and verify that preview invoices show the itemized deduction line.
  3. Turn the toggle OFF and verify that gross fees are charged without deductions.
- Evidence to capture during rehearsal: Screenshots of policy catalog, creation modal, and invoice preview line items.
- Criteria to stop and revise docs: Any miscalculation, rounding discrepancy, or negative bill balance.

---


## 7. Review and Release Signals

## 10. Review Loop

- `R1`: Spec compliance review by Product Owner Sophia Butler and Business Analyst guild.
- `R2`: Architecture and calculation pipeline review by Tech Lead Alan and Systems Architect David.
- `R3`: QA verification readiness and financial invariant review by QA Approver Eve and Ada QA Agent.

---


## Review Loop Tasks

- `R1`: Spec compliance review verifying all functional requirements and acceptance criteria.
- `R2`: Code quality and architecture review checking Redux state isolation and TypeScript strictness.
- `R3`: QA verification review asserting 100% test pass rate and clean build.
- `R4`: Post-evidence reconciliation updating project memory and documentation ledgers.

---


## Review Rounds

| Round | Reviewer | Finding Summary | Required Changes | Disposition |
| --- | --- | --- | --- | --- |
| `R1` | Sophia Butler (Product Owner) | Functional scope covers all exemption and discount requirements | None | Approved |
| `R2` | Alan (Tech Lead) | Conflict resolution and immutability invariants are robust | None | Approved |
| `R3` | Eve (QA Approver) | Verification criteria and edge cases thoroughly mapped | None | Approved |

---


## Release Recommendation

- Recommendation: `GO` for implementation authorization upon operator approval.
- Basis for recommendation: Complete research trace, verified ADR-012 decision record, and zero open clarification questions.
- Required follow-up before wider rollout: Complete unit test suite and execute UI verification.

---


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
- Required read: `.agents/specs/031-finance-tuition-exemption-and-discount-management/execution-brief.md`
- Required read: `.agents/specs/031-finance-tuition-exemption-and-discount-management/spec.md` only if the brief or failing evidence says deeper requirement context is needed.
- Required read: `.agents/specs/031-finance-tuition-exemption-and-discount-management/plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, and `agent-routing.md` only when the current write scope or failing evidence requires the deeper artifact.
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
| Spec challenge | `aurora-plan-challenger` | `spec.md` | Updated `spec.md` or findings |
| Architecture challenge | `alan-tech-lead` | `plan.md` | Updated `plan.md` or findings |
| QA verification sign-off | `eve-qa-approver` | `verification.md` | Evidence-backed release recommendation |

---


## Escalation Rules

- Escalate when documentation prerequisites are missing or misleading.
- Escalate when verification fails repeatedly without new evidence.
- Escalate when write scope conflicts with another agent's ownership.
- Escalate to the human operator if business rules for tuition concessions conflict with municipal regulations.
