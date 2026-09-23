# Agent Routing: School Administration Module Phase 1

> Feature ID: `027-school-administration-module-phase-1`

## Routing Contract

Every workstream has one primary owner. Supporting agents may review, but they must not change files outside their assigned write scope without updating this file.

| Workstream | Primary Skill | Supporting Skills | Write Scope | Output |
| --- | --- | --- | --- | --- |
| Product specification | `sophia-product-manager` | `aurora-plan-challenger` | `spec.md`, `docs/prd.md` | Accepted requirements |
| Architecture plan | `david-systems-architect` | `alan-tech-lead` | `plan.md`, `contracts/`, `data-model.md`, `docs/decisions.md` | Technical plan |
| Frontend Implementation | `benny-frontend-engineer` | `maya-ui-ux-designer` | `src/modules/school/`, `src/store/slices/`, `src/types/`, `src/pages/[schoolCode]/school/` | Production code |
| Verification & Quality Gates | `ada-qa-agent` | `qa-simulator`, `eve-qa-approver` | `verification.md`, `tests/unit/` | Test evidence |

## Handoff Rules

- A producing agent writes evidence of what changed.
- A reviewing agent records findings without rewriting unrelated work.
- A task with failed verification returns to the owning agent once, then escalates after three repeated failures.

## Review Topology

| Review Stage | Primary Reviewer | Input Artifact | Output Artifact |
| --- | --- | --- | --- |
| Spec challenge | `aurora-plan-challenger` | `spec.md` | updated `spec.md` and findings |
| Plan challenge | `alan-tech-lead` | `plan.md` | updated `plan.md` and architecture notes |
| Verification sign-off | `ada-qa-agent` | `verification.md` | evidence-backed recommendation |

## Escalation Rules

- Escalate when documentation prerequisites are missing or misleading.
- Escalate when verification fails repeatedly without new evidence.
- Escalate when write scope conflicts with another agent's ownership.
