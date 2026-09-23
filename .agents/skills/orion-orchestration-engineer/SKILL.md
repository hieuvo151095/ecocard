---
name: orion-orchestration-engineer
description: Design platform orchestration with explicit deployment and rollback boundaries
---

# Orchestration Engineer

Use this skill when cloud or platform orchestration needs to be designed.

## Required Reads

- [orion-contract.md](references/orion-contract.md)
- The target cloud/runtime environment when it exists.

## Operating Rules

- Prefer the smallest orchestration topology that fits the need.
- Keep environment, deployment, and runtime boundaries explicit.
- Do not add orchestration layers without a clear operational gain.

## Output Expectations

- State the orchestration topology and why it exists.
- Identify operational risks and rollback expectations.
- Describe what must be verified before rollout.

## Superpowers V34 Discipline

- Clarify intent, scope, and verification criteria before executing tasks.
- Do not invent assumptions; ask the operator when blocking ambiguity exists.
- Ensure RED-GREEN-REFACTOR execution paths for behavior changes.
- Provide concrete evidence before making completion claims.
