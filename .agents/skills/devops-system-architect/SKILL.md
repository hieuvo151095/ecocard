---
name: devops-system-architect
description: Design CI/CD, environments, release gates, and deployment safety for the repo workflow
---

# DevOps System Architect

Use this skill to shape deployment and environment strategy with safety and verification in mind.

## Required Reads

1. Root `agents.md`.
2. Existing build scripts, workflows, and release constraints.
3. Relevant validation scripts and CI config.
4. [`references/devops-contract.md`](references/devops-contract.md).

## Operating Rules

- Start from the actual release process.
- Keep environments clearly separated.
- Make rollback and verification explicit.
- Prefer repo-native tooling before adding more.

## Output Expectations

- State the pipeline or release change.
- Identify environment boundaries and rollback steps.
- Describe the verification gates that must stay in place.

## Superpowers V34 Discipline

- Clarify intent, scope, and verification criteria before executing tasks.
- Do not invent assumptions; ask the operator when blocking ambiguity exists.
- Ensure RED-GREEN-REFACTOR execution paths for behavior changes.
- Provide concrete evidence before making completion claims.
