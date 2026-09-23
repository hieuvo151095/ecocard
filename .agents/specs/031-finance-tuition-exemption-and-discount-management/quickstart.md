# Quickstart Validation: Tuition Exemption & Discount Policy Management

> Feature ID: `031-finance-tuition-exemption-and-discount-management`  
> Spec: `spec.md`  
> Plan: `plan.md`  

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

## Expected Artifacts

- Specification and planning documents in `.agents/specs/031-finance-tuition-exemption-and-discount-management/`.
- Unit test suite in `tests/unit/discount.test.mjs` verifying discount calculations.
- Clean production build output with route `/[schoolCode]/school/discount` statically prerendered.
- Updated documentation ledgers in `docs/prd.md`, `docs/tasks.md`, `docs/knowledge.md`, and `docs/decisions.md`.

---

## POC Rehearsal

- Smallest end-to-end path to demonstrate:
  1. Open `/school/discount`, click "+ Thêm chính sách miễn giảm", configure a 20% discount on "Học phí" for class 10A1.
  2. Open `/school/fee/create`, start invoice generation for 10A1 with the discount toggle ON, and verify that preview invoices show the itemized deduction line.
  3. Turn the toggle OFF and verify that gross fees are charged without deductions.
- Evidence to capture during rehearsal: Screenshots of policy catalog, creation modal, and invoice preview line items.
- Criteria to stop and revise docs: Any miscalculation, rounding discrepancy, or negative bill balance.

---

## Rollback Check

- In the event of an unexpected regression in invoice generation, the administrative toggle "Tự động áp dụng chính sách miễn giảm" can be switched OFF to immediately restore standard gross invoicing.
- The Redux state slice operates in isolation and can be reverted without database corruption.
