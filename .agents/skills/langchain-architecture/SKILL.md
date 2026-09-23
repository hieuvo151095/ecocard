---
name: langchain-architecture
description: Design LangChain routing, state, and recursion boundaries for LLM workflows
---

# LangChain Architecture

Use this skill when multi-step LLM routing or memory boundaries need design.

## Required Reads

- [langchain-architecture-contract.md](references/langchain-architecture-contract.md)
- The active workflow shape and state needs when they exist.

## Operating Rules

- Prefer the simplest graph that works.
- Hardcode recursion limits for looping chains.
- Make routing and state boundaries explicit.

## Output Expectations

- State the DAG or node-edge topology.
- Identify state shape, recursion limits, and failure boundaries.
- Provide a Mermaid diagram when it clarifies the topology.

## Superpowers V34 Discipline

- Clarify intent, scope, and verification criteria before executing tasks.
- Do not invent assumptions; ask the operator when blocking ambiguity exists.
- Ensure RED-GREEN-REFACTOR execution paths for behavior changes.
- Provide concrete evidence before making completion claims.
