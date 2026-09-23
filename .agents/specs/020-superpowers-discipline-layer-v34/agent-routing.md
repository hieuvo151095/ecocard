# Agent Routing: Superpowers Discipline Layer V34

## Routing Contract

| Workstream | Primary Agent | Write Scope | Output | Verification |
| --- | --- | --- | --- | --- |
| Validator | `alan-tech-lead` | `scripts/validate_superpowers_discipline.py` | marker validator | discipline validator pass |
| Workflow integration | `marcus-ai-orchestrator` | `workflows/*.md` | V34 discipline sections | workflow marker pass |
| Public docs | `marcus-docs-writer` | README, usage guide, registry | command-surface contract | command-surface validator |
| Template integration | `ada-qa-agent` | feature templates | generated V34 defaults | template marker pass |
| Gate wiring | `alan-tech-lead` | harness and readiness scripts | hard gate calls | script inspection and validator output |

## Handoff Rules

- Public docs changes hand off to command-surface validation.
- Workflow and template changes hand off to discipline validation.
- Gate wiring changes hand off to preflight, postflight, docs gate, and
  execution readiness checks.
- Verification evidence must be recorded before release language is used.

## Review Topology

1. Spec compliance review checks whether `FR-001` through `FR-005` are covered.
2. Code quality review checks whether validator logic is simple and actionable.
3. Verification readiness review checks command output and residual risk.

## Escalation Rules

- If a workflow cannot include a required marker without lying about behavior,
  return to planning and adjust the command's real behavior first.
- If command-surface validation fails, update README, usage guide, registry, or
  workflow files rather than bypassing the validator.
- If old specs fail V34 readiness, reconcile the active spec package before
  behavior-changing execution.
