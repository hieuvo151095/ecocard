# Research: Superpowers Discipline Layer V34

## Source Set

- Upstream Superpowers repository `obra/superpowers`, release `v5.1.0`, cloned
  locally for analysis.
- Local Superpowers Codex plugin skill files already installed in the Codex
  plugin cache.
- Marcus Fleet `.agents` constitution, README, usage guide, slash command
  registry, workflows, templates, and validators.

## Findings

- Superpowers is strongest as an execution discipline layer: clarification,
  detailed planning, TDD, systematic debugging, review loops, and
  verification-before-completion.
- Marcus Fleet already has the stronger governance substrate: feature specs,
  command registry, validators, execution brief, development docs, and
  TrustGraph hooks.
- Deep integration should therefore adapt Superpowers behavior into Marcus
  workflow and gate language rather than vendoring upstream files.

## Decision

Use Superpowers as a discipline contract inside Marcus Fleet v34. Keep Marcus
Fleet specs and slash commands canonical.
