---
description: Marcus Fleet Enterprise SDLC Phase 2 V35 (Enterprise Design Board Renderer)
---

# 🎨 ENTERPRISE DESIGN BOARD RENDERER (`/design.board`)

> **CORE ARCHITECTURE MANDATE:**  
> Synthesize brief, context, and coverage inventories into an interactive HTML `board.html` review artifact using a **Modular Sequential Pipeline Architecture**. This prevents output context truncations and ensures 100% maximum high-fidelity detail per screen.

// turbo-all

---

## ⬛ SYSTEMIC MEMORY & STATE INHERITANCE

<state_propagation_boundary>
**DOGMATIC STATE PROPAGATION:** `/design.board` requires validated outputs from `/design` and `/design.coverage`:
1. `design-brief.md`
2. `design-context.md`
3. `flow-inventory.md`, `screen-catalog.md`, `state-coverage.md`
</state_propagation_boundary>

---

## 🔲 DAG TOPOLOGY: CHRONOLOGICAL EXECUTION NODES

### 🔵 NODE 0: MODULAR SEQUENTIAL SCREEN GENERATION & MASTER ASSEMBLY
* *🔗 Input Vector:* All coverage & context files
* *🧠 Injected Tensors:* `design-board-renderer`, `aris-designer`
* *📦 Emitted Artifacts:* `screens/screen_*.html`, `board.html`, `tokens.json`

**[Execution Protocol]:**
1. Read active design system tokens from `design-context.md`.
2. Generate individual screen HTML modules sequentially into `.agents/specs/<feature-id>/screens/screen_01.html`, `screen_02.html`, ..., `screen_N.html`. Each screen module gets dedicated full token budget for high-fidelity UI components, SVG icons, and state banners.
3. Run `python3 .agents/scripts/build_design_board.py --feature <feature-path>` to compile all modular screen files into the master `board.html`.
4. Extract design tokens snapshot into `tokens.json`.

---

### 🟢 NODE 1: ARTIFACT VALIDATION GATE
* *🔗 Input Vector:* `screens/*.html`, `board.html`, `tokens.json`
* *📦 Emitted Artifacts:* Verified design board

**[Execution Protocol]:**
1. Run `python3 .agents/scripts/validate_design_artifacts.py --feature <feature-path>`.
2. Run `python3 .agents/scripts/validate_modular_design.py --feature <feature-path>`.
3. Present `board.html` link to operator for visual inspection.
4. Instruct operator to invoke `/design.prototype` to render interactive prototype screens.
