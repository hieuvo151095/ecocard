---
name: design-discovery
description: Enforce design brief discovery before rendering any UI artifacts. Asks 5-8 targeted clarification questions if brief is ambiguous.
---

# Design Discovery, Fact Verification & Asking-Back Skill (`design-discovery`)

## Objective
`design-discovery` is the mandatory gatekeeper skill for the V35 Design Operating System (synthesizing principles from Open Design, `jiji262/claude-design-skill`, and `Trystan-SA/claude-design-system-prompt`).

Its purpose is to eliminate ambiguity in UI feature requests by enforcing brief discovery, verifying domain facts, and declaring core assets BEFORE any design artifact is generated.

---

## Operating Protocols

### Protocol 1: Fact Verification & Domain Grounding
Before asking questions or drafting copy, verify product names, API specifications, and domain terminology against actual codebase or domain documentation. Do not invent fake product specs or terms.

### Protocol 2: Core Asset Inventory Protocol
Identify branded assets required for the UI:
* Official company logo & partner logos (SVG/PNG paths).
* Product screenshots & real data entity fields.
* Primary brand iconography.
Treat these as primary structural assets rather than secondary style references.

### Protocol 3: Brief Completeness Check
Assess presence of the 5 Mandatory Discovery Fields:
1. `business_goal` (KPI / Measurable outcome)
2. `primary_user` (Target persona & usage environment)
3. `primary_flow` (Step-by-step happy path & failure paths)
4. `constraints` (Technical limits, density, platform priority)
5. `approval_criteria` (Stakeholder sign-off checklist)

### Protocol 4: Refusal & Asking-Back Gatekeeper
Consult [refusal-rules.md](file:///Users/lequynhanh/marcus-fleet/.agents/skills/design-discovery/refusal-rules.md).
* If ANY mandatory field is missing: **HALT VISUAL RENDERING**.
* Issue `clarification-request.md` with 5–8 targeted questions selected from [question-schema.md](file:///Users/lequynhanh/marcus-fleet/.agents/skills/design-discovery/question-schema.md).
* DO NOT generate `board.html`, `prototype.html`, or `components.html`.

---

## Emitted Artifacts
* `design-brief.md`
* `clarification-request.md` (if incomplete)
