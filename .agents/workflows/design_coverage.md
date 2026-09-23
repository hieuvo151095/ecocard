---
description: Marcus Fleet Enterprise SDLC Phase 2 V35 (Flow & State Coverage Planning)
---

# 🗺️ FLOW & STATE COVERAGE PLANNING (`/design.coverage`)

> **CORE ARCHITECTURE MANDATE:**  
> This operational protocol governs the Flow & State Coverage phase. Before rendering any HTML prototypes or boards, the feature MUST be deconstructed into a complete flow inventory, screen catalog, and mandatory 8-state coverage matrix (`initial`, `loading`, `empty`, `populated`, `validation-error`, `system-error`, `success`, `permission-denied`). This prevents output token exhaustion, incomplete UI outputs, and unhandled edge cases.

// turbo-all

---

## ⬛ SYSTEMIC MEMORY & STATE INHERITANCE

<state_propagation_boundary>
**DOGMATIC STATE PROPAGATION:** `/design.coverage` requires approved outputs from `/design`:
1. `design-brief.md`
2. `design-context.md`
</state_propagation_boundary>

---

## 🔲 DAG TOPOLOGY: CHRONOLOGICAL EXECUTION NODES

### 🔵 NODE 0: USER FLOW DECONSTRUCTION
* *🔗 Input Vector:* `design-brief.md`
* *🧠 Injected Tensors:* `flow-coverage-planner`, `noah-agile-product-owner`
* *📦 Emitted Artifacts:* `flow-inventory.md`

**[Execution Protocol]:**
1. Map every user trigger to a step-by-step path (`FLOW-001`, `FLOW-002`).
2. Define actor, preconditions, main steps, alternate paths, failure paths, and destination.
3. Record output in `flow-inventory.md`.

---

### 🟣 NODE 1: SCREEN CATALOG MAPPING
* *🔗 Input Vector:* `flow-inventory.md`
* *🧠 Injected Tensors:* `flow-coverage-planner`, `maya-ui-ux-designer`
* *📦 Emitted Artifacts:* `screen-catalog.md`

**[Execution Protocol]:**
1. Map flows to distinct screen views (`SCR-001`, `SCR-002`).
2. Define primary job, critical components, entry/exit conditions, desktop notes, and mobile notes for each screen.
3. Record output in `screen-catalog.md`.

---

### 🟤 NODE 2: MANDATORY 8-STATE COVERAGE MATRIX
* *🔗 Input Vector:* `screen-catalog.md`
* *🧠 Injected Tensors:* `flow-coverage-planner`, `eve-qa-approver`
* *📦 Emitted Artifacts:* `state-coverage.md`

**[Execution Protocol]:**
1. For EVERY screen in `screen-catalog.md`, define exact UI behavior for all 8 mandatory states:
   * `initial`: Initial unpopulated state.
   * `loading`: Skeleton loader layout.
   * `empty`: Zero-data state with explicit CTA.
   * `populated`: Standard data-rich state.
   * `validation-error`: Inline form validation state.
   * `system-error`: System error alert banner with retry action.
   * `success`: Action success state.
   * `permission-denied`: RBAC access denied card.
2. Record output in `state-coverage.md`.

---

### 🟢 NODE 3: COVERAGE VALIDATION GATE
* *🔗 Input Vector:* `flow-inventory.md`, `screen-catalog.md`, `state-coverage.md`
* *📦 Emitted Artifacts:* Validated coverage package

**[Execution Protocol]:**
1. Run `python3 .agents/scripts/validate_flow_coverage.py --feature <feature-path>`.
2. Confirm 100% of screens have full 8-state coverage.
3. Present coverage summary to operator and instruct to run `/design.board`.
