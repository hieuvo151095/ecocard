---
description: Marcus Fleet Enterprise SDLC Phase 2 V35 (Developer & UAT Handoff Generator)
---

# 📦 DEVELOPER & UAT HANDOFF GENERATOR (`/design.handoff`)

> **CORE ARCHITECTURE MANDATE:**  
> Convert approved design package into developer task mapping (`handoff.md`) and UAT checklist (`uat-checklist.md`). Unlocks `/develop` execution workflow.

// turbo-all

---

## ⬛ SYSTEMIC MEMORY & STATE INHERITANCE

<state_propagation_boundary>
**DOGMATIC STATE PROPAGATION:** Requires `review.md` with status `APPROVED`.
</state_propagation_boundary>

---

## 🔲 DAG TOPOLOGY: CHRONOLOGICAL EXECUTION NODES

### 🔵 NODE 0: HANDOFF SPECIFICATION & UAT MAPPING
* *🔗 Input Vector:* `review.md` (`APPROVED`), `prototype.html`
* *🧠 Injected Tensors:* `handoff-generator`, `alan-tech-lead`
* *📦 Emitted Artifacts:* `handoff.md`, `uat-checklist.md`

**[Execution Protocol]:**
1. Map UI layout sections to frontend implementation tasks (`FE-001`, `FE-002`).
2. Map business rules to backend/API requirements (`BE-001`).
3. Generate UAT test scenarios in `uat-checklist.md`.
4. Run `python3 .agents/scripts/validate_handoff_readiness.py --feature <feature-path>`.
5. UNLOCK `/develop` workflow.
