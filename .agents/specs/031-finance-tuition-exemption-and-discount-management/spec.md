# Feature Specification: Tuition Exemption & Discount Policy Management (Tài Chính — Miễn Giảm)

> Feature ID: `031-finance-tuition-exemption-and-discount-management`  
> Created: `2026-09-21`  
> Status: Approved Design Specification  
> Source Prompt: Planning and Specification for Tuition Exemption & Discount Policy Management under Finance (Tài Chính) Module  
> Epic Reference: `E-017-finance-discount`  

---

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

## 2. User Stories

- [x] As a School Accountant, I need a centralized discount policy catalog so that I can configure and manage fee exemptions, scholarships, and promotional concessions across fee items.
- [x] As a School Accountant, I need to assign discount policies either to entire classes or to specific individual students so that both universal and selective concession programs are supported.
- [x] As a School Accountant, I need the tuition invoice creation wizard to automatically calculate and inject policy deductions into student bills so that manual calculations and bookkeeping errors are eliminated.
- [x] As a School Accountant, I need an administrative toggle in the invoice creation wizard to optionally bypass discount applications for specific billing runs without deactivating master policies.
- [x] As a School Administrator, I need an Excel export of all discount policies and beneficiary rosters so that institutional concession reports can be submitted to school boards and auditing bodies.

---

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

## 4. Non-Functional Requirements

- `NFR-001`: Performance: Discount catalog table must render within 300ms; client-side search and status filtering must respond in under 50ms.
- `NFR-002`: Financial Integrity: All discount deduction arithmetic must use exact integer VND calculations, eliminating floating-point rounding errors and negative bill balances.
- `NFR-003`: Auditability: Historical invoices must remain strictly immutable when discount policies are updated, paused, or expired (Resolution K017).
- `NFR-004`: Design System Compliance: 100% adherence to ECO Design System 1.0 tokens, standard full-width layout (`w-full space-y-6`), and sentence-case Vietnamese typography.
- `NFR-005`: Security: Modifying or deleting discount policies requires School Accountant or School Admin role permissions.

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

## 6. Clarifications

### Question Back Protocol

Before planning or execution, ask back when any answer can change scope, user behavior, security posture, data ownership, rollback, verification, or cost. Each question must name the decision it protects.

### Clarification Ledger

| Question | Why It Matters | Answer or Accepted Risk | Status |
| --- | --- | --- | --- |
| How should overlapping discount policies on the same fee item be combined? | Additive stacking (e.g. 50% + 70%) causes negative bills and over-subsidization. | Apply Highest Discount Priority (`Math.max`) and Scope Specificity (student overrides class). | Resolved (K016) |
| How do policy edits, pauses, or expirations affect past issued invoices? | Financial invoices are legal accounting documents requiring audit permanence. | Mutations apply strictly to future generation runs; historical invoices are immutable. | Resolved (K017) |
| Does the invoice wizard discount toggle alter master policy status in catalog? | Accountants generating an ad-hoc gross billing run must not deactivate policies. | Toggle bypasses discount calculations for that single batch without mutating master policy state. | Resolved (K018) |

---

## 7. Constraints

- Zero unapproved color hexes outside the ECO Design System 1.0 palette.
- Standard full-width frame layout (`w-full space-y-6`) inside `PortalLayout` without artificial container constraints or double padding.
- Strict sentence-case table headers and Vietnamese financial terminology (Miễn giảm, Học phí, Tiền ăn, Xe đưa đón).

---

## 8. Risks

- Risk 1: Inadvertent negative invoice balances caused by excessive fixed deductions: Mitigated by non-negative line-item clamping (`ClampZero`).
- Risk 2: Overlapping discounts creating billing confusion: Mitigated by explicit scope specificity and highest rate resolution rules.

---

## 9. Traceability

- Legal & Regulatory Foundation: Decree 81/2021/NĐ-CP (Tuition exemption policies).
- Architecture Decisions: `docs/decisions.md` (`ADR-012`).
- Tasks: `docs/tasks.md` (`TASK-FIN-006` through `TASK-FIN-009`).
- Evidence & Claims: `docs/research/claims.jsonl` (`C038`-`C042`), `docs/research/evidence.jsonl` (`E039`-`E043`).
- Contradictions & Resolutions: `docs/research/contradictions.md` (`K016`-`K018`).

---

## 10. Review Loop

- `R1`: Spec compliance review by Product Owner Sophia Butler and Business Analyst guild.
- `R2`: Architecture and calculation pipeline review by Tech Lead Alan and Systems Architect David.
- `R3`: QA verification readiness and financial invariant review by QA Approver Eve and Ada QA Agent.

---

## 11. Out of Scope Boundaries

The following capabilities are explicitly out of scope for Phase 1:
- Direct governmental subsidy disbursement tracking via state treasury bank accounts.
- Automated tax deduction filing with the General Department of Taxation (handled via e-invoice integration in fee catalog).
- Multi-currency conversions (all fees and discounts strictly operate in Vietnamese Dong - VND).
