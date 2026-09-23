# Research Notes: Finance Tuition Exemption and Discount Management

> Feature ID: `031-finance-tuition-exemption-and-discount-management`  
> Research References: `docs/research/sources.jsonl`, `docs/research/evidence.jsonl`, `docs/research/claims.jsonl`, `docs/research/contradictions.md`  

---

## Research Questions

- How do multiple overlapping discount policies combine for the same student and fee item?
- How are policy lifecycle states and temporal expirations evaluated against historical invoices?
- How does the invoice creation wizard allow accountants to override discount applications without mutating master policy definitions?

---

## Findings

| Topic | Finding | Source | Decision Impact |
| --- | --- | --- | --- |
| Discount Calculation Types | Percentage discount (0-100%) and Fixed cash deduction (VND) bound to specific fee catalog line items. | S033, S034 | Supports universal and selective concession models. |
| Application Scopes | Dual scope topology: Class cohorts (multi-select classes) or Specific individual students (cross-class picker). | S033 | Enables both class-wide waivers and individual social policy discounts. |
| Conflict Resolution (K016) | Highest Discount Priority (`Math.max`) per line item; student-specific policy takes precedence over class policy. | S034, S035 | Prevents negative balances and eliminates additive over-subsidization. |
| Temporal Lifecycle (K017) | Policies past end date transition to Expired automatically; historical invoices remain strictly immutable. | S034 | Protects financial audit integrity and legal accounting records. |
| Creation Wizard Override (K018) | Admin toggle "Tự động áp dụng chính sách miễn giảm" (default ON) bypasses discounts for a single batch run. | S033 | Permits ad-hoc gross billing runs without disrupting master catalog policies. |

---

## Decisions Ready for Plan

1. Implement Highest Discount Priority and Scope Specificity in `discountValidation.ts`.
2. Enforce non-negative line-item clamping (`deductionAmount <= grossItemAmount`).
3. Maintain immutable frozen snapshot deductions on issued invoices.
4. Integrate the administrative toggle in `CreateInvoiceWizardModal.tsx`.
