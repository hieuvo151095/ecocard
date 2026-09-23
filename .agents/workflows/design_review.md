---
description: Marcus Fleet Enterprise SDLC Phase 2 V35 (Design Review & Compliance Audit)
---

# 📋 STAKEHOLDER DESIGN REVIEW & COMPLIANCE (`/design.review`)

> **CORE ARCHITECTURE MANDATE:**  
> Conduct multi-role review, audit token/component/pattern compliance and visual drift, and package `review-pack.html` and `review.md`.

// turbo-all

---

## ⬛ SYSTEMIC MEMORY & STATE INHERITANCE

<state_propagation_boundary>
**DOGMATIC STATE PROPAGATION:** Requires `board.html`, `prototype.html`, and `components.html`.
</state_propagation_boundary>

---

## 🔲 DAG TOPOLOGY: CHRONOLOGICAL EXECUTION NODES

### 🔵 NODE 0: COMPLIANCE AUDIT & DRIFT REVIEW
* *🔗 Input Vector:* All rendered HTML artifacts
* *🧠 Injected Tensors:* `design-system-compliance`, `design-drift-review`
* *📦 Emitted Artifacts:* `compliance-report.md`

**[Execution Protocol]:**
1. Audit token compliance, component compliance, pattern compliance, and visual drift score.
2. Record output in `compliance-report.md`.

---

### 🟣 NODE 1: STAKEHOLDER REVIEW PACKAGING
* *🔗 Input Vector:* `compliance-report.md`, HTML artifacts
* *🧠 Injected Tensors:* `design-review`, `eve-qa-approver`
* *📦 Emitted Artifacts:* `review-pack.html`, `review.md`

**[Execution Protocol]:**
1. Generate multi-role scorecard in `review.md` (Product Owner, BA, Design Lead, Tech Lead, QA Approver).
2. Package stakeholder review HTML (`review-pack.html`).
3. Run `python3 .agents/scripts/validate_design_review.py --feature <feature-path>`.
4. If approved, instruct operator to run `/design.handoff`.
