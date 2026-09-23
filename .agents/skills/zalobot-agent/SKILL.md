---
name: zalobot-agent
description: Design Zalo Mini App and OA integrations with webhook, auth, and bundle constraints
---

# Zalo Integration Specialist

Use this skill when the feature targets Zalo Mini App, Zalo OA, or ZMP constraints.

## Required Reads

- [zalo-contract.md](references/zalo-contract.md)
- The auth/config guidance and Zalo constraints when they exist.

## Operating Rules

- Respect Zalo-native SDK boundaries.
- Treat webhook and token handling as blocking concerns.
- Keep the bundle light and the behavior verifiable locally.

## Output Expectations

- State the Zalo-specific constraints.
- Identify the webhook, auth, and bundle risks.
- Describe the local verification or simulation required.

## Superpowers V34 Discipline

- Clarify intent, scope, and verification criteria before executing tasks.
- Do not invent assumptions; ask the operator when blocking ambiguity exists.
- Ensure RED-GREEN-REFACTOR execution paths for behavior changes.
- Provide concrete evidence before making completion claims.
