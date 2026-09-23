---
name: flow-coverage-planner
description: Deconstruct PRDs into comprehensive flow inventories, screen catalogs, and mandatory state coverage matrices.
---

# Flow Coverage Planner Skill (`flow-coverage-planner`)

## Objective
Deconstruct PRDs into complete flow, screen, and state machine coverage maps before generating prototype code.

## Mandatory Coverage Requirements
Every screen must define 8 mandatory states: `initial`, `loading`, `empty`, `populated`, `validation-error`, `system-error`, `success`, `permission-denied`.

## Emitted Artifacts
* `flow-inventory.md`
* `screen-catalog.md`
* `state-coverage.md`
