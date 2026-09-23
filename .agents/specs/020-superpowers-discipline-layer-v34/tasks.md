# Task Breakdown: Superpowers Discipline Layer V34

> Feature ID: `020-superpowers-discipline-layer-v34`
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

- [x] `T001` Owner: `alan-tech-lead` Write Scope:
      `scripts/validate_superpowers_discipline.py`. Verification:
      `python3 scripts/validate_superpowers_discipline.py --root /Users/lequynhanh/marcus-fleet`
      reports pass after workflow/template markers exist. Docs:
      `specs/020-superpowers-discipline-layer-v34/verification.md`. Sync: no
      application docs sync because only `.agents` governance files changed.
- [x] `T002` Owner: `marcus-ai-orchestrator` Write Scope:
      `workflows/*.md` for README-published slash commands. Verification:
      discipline validator reports every workflow marker present. Docs:
      `workflows/*.md`, `verification.md`. Sync: record changed command
      discipline in this feature workspace.
- [x] `T003` Owner: `marcus-docs-writer` Write Scope: `README.md`,
      `USAGE_GUIDE.md`, `SLASH_COMMAND_REGISTRY.md`,
      `scripts/validate_command_surface.py`. Verification:
      `python3 scripts/validate_command_surface.py --root /Users/lequynhanh/marcus-fleet`
      reports pass. Docs: public command surface docs. Sync: this feature
      verification records the public docs update.
- [x] `T004` Owner: `ada-qa-agent` Write Scope: `templates/spec-template.md`,
      `templates/plan-template.md`, `templates/tasks-template.md`,
      `templates/verification-template.md`,
      `templates/execution-brief-template.md`. Verification:
      discipline validator reports template markers present. Docs: templates
      and `verification.md`. Sync: generated feature workspaces inherit V34
      discipline.
- [x] `T005` Owner: `alan-tech-lead` Write Scope:
      `scripts/run_required_docs_gates.py`, `scripts/run_harness_preflight.py`,
      `scripts/run_harness_postflight.py`,
      `scripts/validate_execution_readiness.py`. Verification:
      static command inspection and validator runs show the new gate is wired.
      Docs: `verification.md`. Sync: no runtime product sync.

## Parallel Groups

- Group A: `T002` and `T004` are parallel-safe because workflow files and
  templates have disjoint write scopes.
- Group B: `T003` and `T005` must run after `T001` because they reference the
  new validator.

## Execution Monitoring

- Required pre-code gates: spec package accepted and marker contract designed.
- Mid-slice checkpoints: run discipline validator after workflow/template edits,
  then command-surface validator after public docs/registry edits.
- Circuit breaker after repeated failure: if the validator fails three times on
  the same marker family, stop and reassess the marker contract rather than
  widening phrases randomly.
- Human escalation trigger: validator blocks a valid workflow behavior or
  command-surface validation requires changing public command semantics.

## Review Loop Tasks

- `R1`: Spec compliance review task: confirm `FR-001` through `FR-005` map to
  files and verification.
- `R2`: Code quality review task: confirm validator maps are simple,
  deterministic, and report actionable errors.
- `R3`: Verification readiness review task: run discipline and command-surface
  validators.
- `R4`: Post-evidence reconcile task: update `verification.md` with command
  results and residual risk.

## Completion Checklist

- [x] `spec.md` accepted
- [x] `plan.md` accepted
- [x] `contracts/` intentionally not expanded because the marker contract is
      documented in `plan.md#4. Contracts`
- [x] `tasks.md` complete
- [x] `verification.md` contains evidence
- [x] Root `agents.md` updated
- [x] TrustGraph write attempted
