---
description: Marcus Fleet Enterprise SDLC Phase 2 V35 (Design Operating System & Discovery Gate)
---

# 🎨 DESIGN OPERATING SYSTEM & DISCOVERY GATE (`/design`)

> **CORE ARCHITECTURE MANDATE:**  
> This operational protocol governs Phase 2 (Qualitative, Aesthetic, UI/UX, & Discovery Gate) of the Marcus Fleet SDLC. It operates as an **Artifact-First Design Engine**. Rendering any HTML visual artifact before discovery passes is STRICTLY FORBIDDEN. If input briefs or PRDs lack business goals, user personas, primary flows, constraints, or approval criteria, the system MUST HALT, execute the asking-back protocol, and issue 5–8 targeted clarification questions.

// turbo-all

---

## ⬛ SYSTEMIC MEMORY & STATE INHERITANCE (ANTI-AMNESIA PROTOCOLS)

<state_propagation_boundary>
**DOGMATIC STATE PROPAGATION:** The `/design` sequence initiates when a feature request or PRD is received. The LLM context buffer MUST ingest:
1. Root `agents.md` & `.agents/memory/constitution.md`
2. `.agents/design-systems/company/DESIGN.md` (and domain extensions)
3. Input PRD (`prd.md` or prompt) and business rules (`business-rules.md`)
</state_propagation_boundary>

---

## 🔲 DAG TOPOLOGY: CHRONOLOGICAL EXECUTION NODES (PHASE 2)

### 🔵 NODE 0: BRIEF INGESTION & DISCOVERY GATEKEEPER
* *🔗 Input Vector:* `prd.md`, `business-rules.md`, user prompt
* *🧠 Injected Tensors:* `design-discovery`, `sophia-product-manager`
* *📦 Emitted Artifacts:* `design-brief.md` OR `clarification-request.md`

**[Execution Protocol]:**
1. Inspect the input request against the 5 Mandatory Discovery Fields:
   * `business_goal`: Measurable business outcome/KPI.
   * `primary_user`: Target persona & context.
   * `primary_flow`: Key step-by-step user path.
   * `constraints`: Technical, business, or layout limits.
   * `approval_criteria`: Acceptance criteria for handoff.
2. **REFUSAL GATE**: If ANY field is missing or ambiguous:
   * **HALT VISUAL RENDERING IMMEDIATELY**.
   * Select 5–8 targeted questions from `.agents/skills/design-discovery/question-schema.md`.
   * Emit `clarification-request.md` and present questions to the operator.
   * **DO NOT PROCEED TO NODE 1**.
3. If inputs are complete, populate `design-brief.md`.
4. Run `python3 .agents/scripts/validate_design_readiness.py --root . --feature <feature-path>`.

---

### 🟣 NODE 1: DESIGN SYSTEM BINDING & CONTEXT GENERATION
* *🔗 Input Vector:* `design-brief.md`
* *🧠 Injected Tensors:* `design-system-selector`
* *📦 Emitted Artifacts:* `design-context.md`

**[Execution Protocol]:**
1. Analyze the feature brief domain:
   * Business forms, approval chains, transaction grids → Bind `.agents/design-systems/erp-enterprise/DESIGN.md`
   * Telemetry, alerts, infrastructure monitoring → Bind `.agents/design-systems/ops-monitoring/DESIGN.md`
   * Board readouts, executive dashboards → Bind `.agents/design-systems/executive-insight/DESIGN.md`
   * Default enterprise features → Bind `.agents/design-systems/company/DESIGN.md`
2. Synthesize binding snapshot into `design-context.md` containing active version, allowed tokens, allowed components, allowed layout patterns, and forbidden moves.
3. Run `python3 .agents/scripts/validate_design_system_selection.py --root . --feature <feature-path>`.

---

### 🟤 NODE 2: DIRECTION ADVISORY (OPTIONAL FOR NEW ART DIRECTIONS)
* *🔗 Input Vector:* `design-brief.md`, `design-context.md`
* *🧠 Injected Tensors:* `design-direction-advisor`
* *📦 Emitted Artifacts:* `direction-options.md`

**[Execution Protocol]:**
1. If art direction or visual tone requires stakeholder alignment, formulate 2–3 structured design direction options (Tone, Suitability, Advantages, Risks, Recommendation).
2. Save options in `direction-options.md`.

---

### 🟢 NODE 3: PHASE 2 DISCOVERY CLOSEOUT GATE
* *🔗 Input Vector:* `design-brief.md`, `design-context.md`
* *📦 Emitted Artifacts:* Verified feature workspace state

**[Execution Protocol]:**
1. Run `python3 .agents/adapters/trustgraph_query.py --task "Design Phase Boot"` to query historic design patterns.
2. Confirm `validate_design_readiness.py --root .`, `validate_design_system_selection.py`, and `python3 .agents/scripts/validate_design_outputs.py --root .` passed clean.
3. Run `python3 .agents/scripts/run_required_docs_gates.py --root . --mode auto`.
4. Present `design-brief.md` and `design-context.md` to the operator.
5. Instruct operator to invoke `/design.coverage` to proceed to Flow & State Coverage Planning.

---

## 🛑 POINT OF NO RETURN: DISCOVERY HALT

> **[HALT COMMAND INITIATED]**  
> You have completed `/design` (Discovery & Binding Phase). You are strictly forbidden from rendering HTML prototype code until `/design.coverage` and `/design.board` are completed.  
> **NEXT COMMAND**: Invoke `/design.coverage` to expand flows and 8-state coverage matrices.

---

## Superpowers V34 Discipline Integration

* **Clarify Visual Intent Before Rendering**: Never generate HTML artifacts on incomplete prompts; clarify visual intent, target user, workflow density, platform, and accessibility constraints first.
* **Ask Compact, High-Leverage Questions**: Always ask 5–8 targeted questions when requirements are underspecified.
* **Systematic Gate Validation**: Run python validator scripts before claiming readiness.
