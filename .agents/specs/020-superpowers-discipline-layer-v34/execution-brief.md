# Execution Brief: Feature Specification: Superpowers Discipline Layer V34

> Feature ID: `020-superpowers-discipline-layer-v34`
> Task Shape: `architecture-refactor`
> Generated From: `spec.md`, `plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, `agent-routing.md`

## 1. Operator Intent Snapshot

## 1. Purpose

Marcus Fleet already has strong governance artifacts, but its slash commands can
still drift into ceremony if the operating rules do not force disciplined agent
behavior. V34 adds a Superpowers-inspired discipline layer to the public command
surface so agents clarify before planning, plan before code, use TDD for
behavior changes, investigate root cause before fixes, review requirement
compliance before code style, and avoid completion claims without fresh
evidence. The outcome is a more logical `.agents` runtime whose main commands
ask sharper questions, execute in smaller verified slices, and stop when the
package lacks proof.


## 2. Required Behavior

## 3. Functional Requirements

- `FR-001`: The system MUST expose Superpowers V34 discipline in every main
  slash-command workflow published in `README.md` and `USAGE_GUIDE.md`.
- `FR-002`: The system MUST provide a validator that checks workflow and
  template markers for clarification-first, no-placeholder planning, TDD,
  systematic debugging, spec-before-quality review, and evidence-before-claim.
- `FR-003`: The system MUST wire the validator into readiness, preflight,
  postflight, docs gates, and routecheck so discipline is a hard gate.
- `FR-004`: The system MUST update generated templates so future feature
  workspaces include a Clarification Ledger, V34 planning gates, task TDD
  rules, and verification-before-completion rules.
- `FR-005`: The public README, usage guide, and slash-command registry MUST
  document the new discipline gate and routecheck invocation.


## 5. Acceptance Criteria

- `AC-001`: Given any main workflow published in README, when
  `validate_superpowers_discipline.py --root .` runs, then the workflow must
  include its required Superpowers V34 markers.
- `AC-002`: Given new feature templates, when a workspace is generated, then it
  must include the Clarification Ledger, V34 discipline gates, TDD task rules,
  and evidence-before-claim verification language.
- `AC-003`: Given `/marcus.routecheck`, when the command surface is validated,
  then `validate_superpowers_discipline.py --root .` must be part of the
  required routecheck invocation chain.
- `AC-004`: Given behavior-changing execution readiness, when
  `validate_execution_readiness.py` runs for a feature, then the V34 discipline
  validator must also run for that feature.
- `AC-005`: Given harness preflight, postflight, or docs gates, when those
  scripts run, then the V34 discipline validator must be executed before the
  command can pass.


## 3. Scope Boundaries

## 7. Constraints

- Constitution articles that apply: specification source of truth, clarify
  before planning, contracts before code, test-first verification, mandatory
  review loop, and POC rehearsal.
- Existing files in scope: README, usage guide, slash command registry,
  workflow files, templates, harness gate scripts, execution readiness script,
  and a new validator.
- Files out of scope: TrustGraph storage internals, MCP package installation,
  third-party Superpowers source files, and generated dependency folders.
- Compatibility requirements: current validators must keep passing after
  command-surface updates.
- Rollback expectations: remove the new validator calls and Superpowers V34
  workflow/template sections if the discipline layer blocks valid existing
  workflows.

Out of scope:

- Vendoring the full `obra/superpowers` repo.
- Replacing Marcus Fleet feature specs with `docs/superpowers/*`.
- Changing runtime product code outside `.agents`.


## 4. Active Work Slice

## 1. Technical Summary

V34 adds a first-class Superpowers discipline contract to Marcus Fleet without
vendoring Superpowers or changing Marcus Fleet's canonical spec topology. The
implementation adds a marker-based validator, wires it into existing harness
gates, updates templates for future workspaces, and adds discipline sections to
the slash-command workflows published in README. The validator is intentionally
simple and deterministic: it checks local files for required behavioral markers
and reports exact drift.


## 6. Agent Routing

| Workstream | Primary Agent | Output | Verification |
| --- | --- | --- | --- |
| Validator implementation | `alan-tech-lead` | `scripts/validate_superpowers_discipline.py` | validator pass/fail smoke |
| Workflow discipline | `marcus-ai-orchestrator` | `workflows/*.md` sections | discipline validator |
| Template upgrade | `sophia-product-manager` and `ada-qa-agent` | updated templates | generated feature marker checks |
| Public docs and registry | `marcus-docs-writer` | README, usage guide, registry | command surface validation |
| Gate wiring | `alan-tech-lead` | harness scripts and readiness script | preflight/postflight/docs gate commands |

Execution monitoring:

- Blocking gates before implementation: spec validation and discipline validator
  design review.
- Evidence checkpoints: validator root pass, command surface pass, feature
  marker pass.
- Escalation condition: if validator blocks valid wording, update marker map
  rather than bypassing the gate.


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


## 4.1 Dynamic Execution Signals

### Changed Files

- No changed files were provided for this brief rebuild.

### Failing Evidence

- No failing evidence was provided for this brief rebuild.

## Execution Monitoring

- Required pre-code gates: spec package accepted and marker contract designed.
- Mid-slice checkpoints: run discipline validator after workflow/template edits,
  then command-surface validator after public docs/registry edits.
- Circuit breaker after repeated failure: if the validator fails three times on
  the same marker family, stop and reassess the marker contract rather than
  widening phrases randomly.
- Human escalation trigger: validator blocks a valid workflow behavior or
  command-surface validation requires changing public command semantics.


## 5. Development Ledger Context

Read these development-ledger notes before source edits for the active slice:

No `docs/development/` notes matched this feature workspace.
Before behavior-changing code work, create or reconcile the development ledger for this feature slice.
Preferred paths:
- If the feature is new: run `python3 .agents/scripts/create_development_docs.py --name "<epic-or-feature-name>" --feature-id "<feature-id>" --epic-number 001 --child-number 001 --task-number 001`.
- If the project is brownfield or docs are stale: route to `/doc_reconcile` and repair the ledger before source edits.

## 6. Verification Path

## Verification Plan

| Requirement | Method | Command or Procedure | Expected Result |
| --- | --- | --- | --- |
| `FR-001` | Workflow marker validation | `python3 scripts/validate_superpowers_discipline.py --root /Users/lequynhanh/marcus-fleet` | Reports workflow markers present |
| `FR-002` | Validator smoke | Run discipline validator after marker edits | Reports exact missing markers or pass |
| `FR-003` | Gate wiring inspection | Inspect harness and readiness scripts, then run discipline validator | Validator is included in gate chains |
| `FR-004` | Template marker validation | Discipline validator checks template markers | Reports template markers present |
| `FR-005` | Command surface validation | `python3 scripts/validate_command_surface.py --root /Users/lequynhanh/marcus-fleet` | Reports public docs, registry, and workflows agree |


## Execution Gates

- Pre-implementation gates passed: `validate_superpowers_discipline.py` was
  created before public command surface closeout.
- Plan/contract readiness confirmed: marker contract is documented in
  `plan.md#4. Contracts`.
- Documentation targets created or reconciled: README, usage guide, registry,
  workflows, templates, and this feature workspace were updated.
- Required human approvals: operator approved deep integration direction B and
  requested README-published slash command coverage.

### Evidence-before-claim Gate

NO COMPLETION CLAIMS are allowed until the exact command or manual procedure was
run fresh, the output was inspected, and the result was recorded below. Do not
infer success from partial checks, previous sessions, or agent reports.


## Local Preconditions

- Work from `/Users/lequynhanh/marcus-fleet/.agents`.
- Ensure the duplicate empty workspace created during drafting has been removed.
- Treat `.agents` as its own git repository.


## Validation Path

Run these commands from `.agents`:

```bash
python3 scripts/validate_superpowers_discipline.py --root /Users/lequynhanh/marcus-fleet
python3 scripts/validate_command_surface.py --root /Users/lequynhanh/marcus-fleet
python3 scripts/validate_specs.py --feature specs/020-superpowers-discipline-layer-v34
```

Expected result: each command exits with status `0` and prints a pass summary.


## POC Rehearsal

The smallest credible POC is the validator itself:

1. Run the discipline validator at root.
2. Confirm it reports workflow and template markers present.
3. Run command-surface validation.
4. Confirm routecheck now includes the V34 discipline validator.


## 7. Review and Release Signals

## 10. Review Loop

| Round | Reviewer | Focus | Exit Criteria | Status |
| --- | --- | --- | --- | --- |
| `R1` | `aurora-plan-challenger` | Scope challenge | v34 applies only to command discipline, not full repo vendoring | Resolved |
| `R2` | `ada-qa-agent` | Gate quality | validator is wired into replayable scripts | Resolved |
| `R3` | `marcus-ai-orchestrator` | Go/no-go to execution | README, registry, workflows, and templates agree | Resolved |


## Review Loop Tasks

- `R1`: Spec compliance review task: confirm `FR-001` through `FR-005` map to
  files and verification.
- `R2`: Code quality review task: confirm validator maps are simple,
  deterministic, and report actionable errors.
- `R3`: Verification readiness review task: run discipline and command-surface
  validators.
- `R4`: Post-evidence reconcile task: update `verification.md` with command
  results and residual risk.


## Review Rounds

| Round | Reviewer | Finding Summary | Required Changes | Disposition |
| --- | --- | --- | --- | --- |
| `R1` | Spec compliance reviewer | V34 scope is command discipline, not Superpowers vendoring. | Keep Marcus specs canonical. | Resolved |
| `R2` | Code quality reviewer | Marker validator should stay deterministic and centralized. | Use explicit marker maps. | Resolved |
| `R3` | Verification reviewer | Completion requires fresh command evidence. | Run discipline, command-surface, and readiness validators. | Resolved |


## Release Recommendation

- Recommendation: `GO WITH RESIDUAL RISK`
- Basis for recommendation: discipline validation, command-surface validation,
  and feature execution readiness all pass with fresh evidence.
- Required follow-up before wider rollout: restart local TrustGraph if graph
  memory is required for this release.


## 7.1 Superpowers Discipline Snapshot

- clarification status: read `spec.md#6. Clarifications` before planning or widening scope.
- TDD or accepted exception: behavior-changing tasks must name RED-GREEN-REFACTOR or an explicit accepted exception.
- Root cause status for bugfix work: reproduce and identify cause before mutation.
- Review order: spec compliance before code quality.
- Completion claim gate: fresh verification required before success language.

## 8. Context Expansion Rules

### Task Shape Decision

- Selected task shape: `architecture-refactor`
- Why this shape: Read decisions, diagrams, affected modules, and execution boundaries first.

### Required Reads

- Required read: `agents.md`
- Required read: `.agents/memory/constitution.md`
- Required read: `.agents/specs/020-superpowers-discipline-layer-v34/execution-brief.md`
- Required read: `.agents/specs/020-superpowers-discipline-layer-v34/spec.md` only if the brief or failing evidence says deeper requirement context is needed.
- Required read: `.agents/specs/020-superpowers-discipline-layer-v34/plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, and `agent-routing.md` only when the current write scope or failing evidence requires the deeper artifact.
- Required read: create or reconcile the missing `docs/development/` notes before behavior-changing source edits.

### Forbidden Default Reads

- Forbidden by default: full repo scans without a bounded module list
- Forbidden by default: random DB exploration unrelated to the refactor boundary
- Forbidden by default: random UI exploration unrelated to the refactor boundary

### Expansion Triggers

- Read decisions, diagrams, affected modules, and execution boundaries first.
- Do not scan the full repo without a bounded module list.
- Load architecture/refactor skills first.
- Read the `docs/development/` notes listed in this brief before widening beyond the current work slice.
- If the required epic/feature/module/page/task note is missing, stop and reconcile the development ledger instead of improvising from code alone.

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
