# Agent Routing: Tuition Exemption & Discount Policy Management

> Feature ID: `031-finance-tuition-exemption-and-discount-management`  
> Spec: `spec.md`  
> Plan: `plan.md`  

---

## Routing Contract

Every workstream needs one primary owner. Supporting agents may review, but they must not change files outside their assigned write scope without updating this file.

| Workstream | Primary Skill | Supporting Skills | Write Scope | Output |
| --- | --- | --- | --- | --- |
| Product specification | `sophia-product-manager` | `aurora-plan-challenger` | `spec.md`, `docs/prd.md` | Accepted requirements |
| Architecture & Calculation Engine | `david-systems-architect` | `alan-tech-lead` | `plan.md`, `src/utils/discountValidation.ts`, `data-model.md` | Technical plan & math engine |
| UI & State Implementation | `benny-frontend-engineer` | `aris-designer` | `src/modules/finance/discount/`, `src/store/slices/discountSlice.ts`, `src/pages/` | Interactive UI & state |
| Verification & Testing | `ada-qa-agent` | `eve-qa-approver` | `tests/unit/discount.test.mjs`, `verification.md` | Evidence & test suites |

---

## Handoff Rules

- A producing agent writes concrete evidence of what changed.
- A reviewing agent records findings without rewriting unrelated work.
- A task with failed verification returns to the owning agent once, then escalates after three repeated failures.
- No code generation is initiated until the operator grants explicit authorization following planning review.

---

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
