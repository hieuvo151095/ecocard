---
name: design-system-selector
description: Bind feature briefs to appropriate active domain design systems (company, erp-enterprise, ops-monitoring, executive-insight).
---

# Design System Selector Skill (`design-system-selector`)

## Objective
Analyze domain and feature type to bind the feature to the correct `DESIGN.md` contract. Generates `design-context.md`.

## Selection Rules
* Complex business/forms/tables → `erp-enterprise`
* Telemetry/alerts/monitoring → `ops-monitoring`
* Executive summaries/KPI readouts → `executive-insight`
* Default → `company`

## Emitted Artifacts
* `design-context.md`
