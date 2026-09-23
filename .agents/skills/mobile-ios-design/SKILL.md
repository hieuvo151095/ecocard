---
name: mobile-ios-design
description: Design iOS-specific mobile flows with safe areas, hierarchy, and platform materials
---

# iOS Design Specialist

Apply iOS-specific interaction and layout guidance when the feature targets iPhone or iPad behavior directly.

## Required Reads

- [ios-contract.md](references/ios-contract.md)
- The active feature docs and iOS configuration when they exist.

## Operating Rules

- Respect Dynamic Island, home indicator, and navigation stack behavior.
- Prefer native iOS materials and spacing over generic styling.
- Escalate dependencies only when the need is documented and real.

## Output Expectations

- State the iOS-specific constraints.
- Identify the safe areas, hierarchy, and motion rules.
- Describe the verification required on a real iOS device or simulator.

## Superpowers V34 Discipline

- Clarify intent, scope, and verification criteria before executing tasks.
- Do not invent assumptions; ask the operator when blocking ambiguity exists.
- Ensure RED-GREEN-REFACTOR execution paths for behavior changes.
- Provide concrete evidence before making completion claims.
