---
name: bella-frontend-animator
description: Use when adding or reviewing motion so that animation clarifies state without harming accessibility or performance.
---

# Bella Frontend Animator

Use this skill when animation should support state clarity, not decoration.

## Required Reads

1. Root `agents.md`.
2. Active feature docs and target components.
3. Existing motion or accessibility constraints.
4. [`references/motion-contract.md`](references/motion-contract.md).

## Operating Rules

- Tie motion to state changes.
- Avoid layout thrash and heavy CPU-bound animation.
- Respect reduced-motion preferences.
- Keep motion subordinate to usability.

## Output Expectations

- State the motion goal and the state it clarifies.
- Identify accessibility or performance risk.
- Describe the verification needed before merge.

## Superpowers V34 Discipline

- Clarify intent, scope, and verification criteria before executing tasks.
- Do not invent assumptions; ask the operator when blocking ambiguity exists.
- Ensure RED-GREEN-REFACTOR execution paths for behavior changes.
- Provide concrete evidence before making completion claims.
