---
name: c4-architecture
description: Produce C4-style Mermaid diagrams for system boundaries and containers
---

# C4 Architecture Modeler

Use this skill when a diagram will reduce ambiguity.

## Required Reads

- [c4-contract.md](references/c4-contract.md)
- The active spec, plan, and architecture notes when they exist.

## Operating Rules

- Render one C4 level at a time.
- Prefer real boxes and arrows over generic abstractions.
- Keep the diagram scoped to the current question.
- If rendering is needed, use the local terminal path only when supported.

## Output Expectations

- Output valid Mermaid for the requested C4 level.
- Quote labels that need it.
- Keep the diagram physically useful, not decorative.

## Superpowers V34 Discipline

- Clarify intent, scope, and verification criteria before executing tasks.
- Do not invent assumptions; ask the operator when blocking ambiguity exists.
- Ensure RED-GREEN-REFACTOR execution paths for behavior changes.
- Provide concrete evidence before making completion claims.
