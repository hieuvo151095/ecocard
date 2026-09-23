# Task Breakdown: {{FEATURE_TITLE}}

> Feature ID: `{{FEATURE_ID}}`
> Plan: `plan.md`

## Task Rules

- `[P]` means parallel-safe with disjoint write scope.
- Every task needs one owner and one verification method.
- Do not mark a task complete until `verification.md` has evidence.
- Every task must name the documentation artifact it updates before or alongside
  code.
- Every implementation task must declare what would block or fail it.

## Superpowers V34 Task Discipline

- Implementation tasks must be bite-sized and include exact file paths.
- Behavior-changing tasks must name the RED-GREEN-REFACTOR path:
  1. write or identify the failing test,
  2. run it and record the expected failure,
  3. implement the minimal fix,
  4. run the passing verification.
- Bugfix tasks must record root cause evidence before any fix.
- Review tasks must run in this order: spec compliance, then code quality.
- If a task cannot satisfy TDD, record the explicit exception and accepted risk.

## Tasks

- [ ] `T001` Owner: `sophia-product-manager` Write Scope: `spec.md`.
      Verification: no unresolved clarification markers unless explicitly
      accepted. Docs: `spec.md`, `verification.md`. Sync: n/a before code.
- [ ] `T002` Owner: `david-systems-architect` Write Scope: `plan.md`,
      `data-model.md`, `contracts/`, `quickstart.md`. Verification:
      constitution gates pass and interface boundaries are documented. Docs:
      `plan.md`, `data-model.md`, `quickstart.md`. Sync: update traceability if
      planning scope changes.
- [ ] `T003` Owner: `marcus-ai-orchestrator` Write Scope: `agent-routing.md`,
      `tasks.md`. Verification: every workstream has one owner, one write scope,
      one artifact, and one escalation path. Docs: `agent-routing.md`,
      `tasks.md`. Sync: update task matrix when write scopes or ordering change.
- [ ] `T004` Owner: `ada-qa-agent` Write Scope: `verification.md`.
      Verification: commands or manual checks are repeatable and tied to
      requirements. Docs: `verification.md`. Sync: append evidence and residual
      risk after each material execution slice.

## Parallel Groups

- Group A: TBD
- Group B: TBD

## Execution Monitoring

- Required pre-code gates:
- Mid-slice checkpoints:
- Circuit breaker after repeated failure:
- Human escalation trigger:

## Review Loop Tasks

- `R1`: Spec compliance review task:
- `R2`: Code quality review task:
- `R3`: Verification readiness review task:
- `R4`: Post-evidence reconcile task:

## Completion Checklist

- [ ] `spec.md` accepted
- [ ] `plan.md` accepted
- [ ] `contracts/` complete or explicitly not applicable
- [ ] `tasks.md` complete
- [ ] `verification.md` contains evidence
- [ ] Root `agents.md` updated
- [ ] TrustGraph write attempted
