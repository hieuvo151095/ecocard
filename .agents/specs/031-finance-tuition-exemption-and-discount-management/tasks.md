# Task Breakdown: Tuition Exemption & Discount Policy Management

> Feature ID: `031-finance-tuition-exemption-and-discount-management`  
> Plan: `plan.md`  

---

## Task Rules

- `[P]` means parallel-safe with disjoint write scope.
- Every task has one owner and one verification method.
- No completion language is used until `verification.md` has recorded concrete evidence.
- Every task declares the documentation and code artifacts it touches.

---

## Superpowers V34 Task Discipline

- Tasks are structured cleanly with explicit file paths.
- Behavior-changing tasks follow the RED-GREEN-REFACTOR cycle with unit tests.
- Review tasks follow strict order: spec compliance before code quality.
- Fresh verification evidence is required before completing any task.

---

## Tasks

- [ ] `T001` Owner: `alan-tech-lead` Write Scope: `src/types/discount.ts`, `src/utils/discountValidation.ts`. Verification: Run unit test assertions for conflict resolution, specificity precedence, and clamping. Docs: `spec.md`, `data-model.md`. Sync: Update TypeScript types and validation contracts.
- [ ] `T002` Owner: `benny-frontend-engineer` Write Scope: `src/store/slices/discountSlice.ts`, `src/modules/finance/discount/`. Verification: Verify Redux state transitions (create, edit, pause, resume, delete) and filter actions. Docs: `plan.md`, `tasks.md`. Sync: Register discount slice in root store.
- [ ] `T003` Owner: `benny-frontend-engineer` Write Scope: `src/pages/[schoolCode]/school/discount/`, `src/modules/finance/discount/CreateDiscountPolicyModal.tsx`, `StudentPickerModal.tsx`. Verification: Verify UI layout, dual scope selectors, and form submission validation. Docs: `quickstart.md`. Sync: Update navigation links and layout hierarchy.
- [ ] `T004` Owner: `benny-frontend-engineer` Write Scope: `src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`, `src/store/slices/invoiceSlice.ts`. Verification: Verify automatic discount deduction injection and administrative override toggle. Docs: `spec.md`, `plan.md`. Sync: Keep historical invoice records immutable.
- [ ] `T005` Owner: `benny-frontend-engineer` Write Scope: `src/modules/finance/discount/discountExport.ts`. Verification: Validate Excel workbook generation and beneficiary roster formatting. Docs: `verification.md`. Sync: Export metadata headers and UTF-8 diacritics.
- [ ] `T006` Owner: `ada-qa-agent` Write Scope: `tests/unit/discount.test.mjs`, `verification.md`. Verification: Execute full test suite `npm test` and verify zero regressions. Docs: `verification.md`. Sync: Append test execution logs and release recommendation.

---

## Parallel Groups

- Group A: Data contracts and business logic validation (`T001`) can proceed independently.
- Group B: Discount catalog UI (`T002`, `T003`) and Invoicing integration (`T004`) build on validated contracts.
- Group C: Excel export (`T005`) and QA test automation (`T006`) verify end-to-end functionality.

---

## Execution Monitoring

- Required pre-code gates: Specification approval, data contracts definition, and ADR-012 registration.
- Mid-slice checkpoints: Validate calculation engine tests passing 100% before mounting UI components.
- Circuit breaker after repeated failure: Halt implementation if discount calculation produces negative balances or regresses existing invoice generation.
- Human escalation trigger: Escalate to Tech Lead if discount priority rules conflict with school accounting requirements.

---

## Review Loop Tasks

- `R1`: Spec compliance review verifying all functional requirements and acceptance criteria.
- `R2`: Code quality and architecture review checking Redux state isolation and TypeScript strictness.
- `R3`: QA verification review asserting 100% test pass rate and clean build.
- `R4`: Post-evidence reconciliation updating project memory and documentation ledgers.

---

## Completion Checklist

- [ ] `spec.md` accepted with zero open questions
- [ ] `plan.md` approved with verified architecture
- [ ] `data-model.md` and contracts registered
- [ ] `tasks.md` broken into discrete deliverables
- [ ] `verification.md` populated with test evidence
- [ ] Root `AGENTS.md` updated with session progress
- [ ] Documentation gates pass 100%
