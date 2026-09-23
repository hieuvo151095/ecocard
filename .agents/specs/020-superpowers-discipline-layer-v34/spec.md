# Feature Specification: Superpowers Discipline Layer V34

> Feature ID: `020-superpowers-discipline-layer-v34`
> Created: `2026-05-18`
> Status: Accepted for implementation
> Source Prompt: Upgrade Marcus Fleet `.agents` to v34 by integrating Superpowers-style clarification, planning, TDD, debugging, review, and verification discipline into the main slash commands published in README.

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

## 2. User Stories

- [x] As the system owner, I need every README-published slash command to carry
      explicit Superpowers V34 discipline so the behavior is visible and
      enforceable.
- [x] As an operator, I need agents to ask back when intent, scope, data,
      rollback, or verification is unclear so they do not silently invent
      requirements.
- [x] As a reviewer, I need validation scripts to fail when workflows or
      templates lose clarification, TDD, debugging, review, or verification
      guardrails.
- [x] As an internal operator, I need the upgrade itself recorded in a feature
      workspace so the system remains auditable.

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

## 4. Non-Functional Requirements

- `NFR-001`: Performance: the discipline validator must be file-marker based and
  fast enough to run during every harness preflight and postflight.
- `NFR-002`: Security: no network installer, shell `eval`, or secret handling is
  introduced by the V34 discipline layer.
- `NFR-003`: Observability: failed discipline checks must print the exact file
  and missing marker.
- `NFR-004`: Maintainability: the validator must keep marker maps centralized so
  future command changes are easy to update.
- `NFR-005`: Documentation and traceability: README, usage guide, registry,
  workflow files, templates, and this feature workspace must agree.

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

## 6. Clarifications

### Superpowers V34: Question Back Protocol

Before planning, ask back when any answer can change scope, user behavior,
security posture, data ownership, rollback, verification, cost, visual intent,
or platform constraints. Each question must name the decision it protects. Do
not ask curiosity questions that cannot change the plan.

### Clarification Ledger

| Question | Why It Matters | Answer or Accepted Risk | Status |
| --- | --- | --- | --- |
| Should V34 be a deep integration rather than a lightweight bridge? | Determines whether validators and slash command workflows must change. | Operator chose deep integration, direction B. | Resolved |
| Should the discipline apply to README-published slash commands, not only hidden workflows? | Determines public command surface scope. | Operator explicitly requested applying it to main slash commands mentioned in README. | Resolved |
| Should Superpowers become a second source of truth? | Determines documentation topology. | No. Marcus Fleet specs, workflows, templates, and validators remain canonical. | Resolved |

No unresolved clarification markers remain.

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

## 8. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Validator becomes too brittle around wording. | Legitimate wording edits could fail gates. | Keep marker maps centralized and concrete; update tests with workflow edits. |
| V34 adds ceremony without better execution. | Agents may spend more time on docs. | Tie discipline to observable gates: clarification, TDD, root cause, review order, evidence. |
| Old feature workspaces lack V34 markers. | Readiness may require migration for old specs. | Treat this as a v34 upgrade boundary and reconcile active specs before execution. |

## 9. Traceability

| Requirement | Plan Section | Tasks | Verification |
| --- | --- | --- | --- |
| `FR-001` | `plan.md#3. Architecture` | `T002`, `T003` | `AC-001`, discipline validator |
| `FR-002` | `plan.md#4. Contracts` | `T001`, `T004` | validator smoke and failure output |
| `FR-003` | `plan.md#6. Agent Routing` | `T005` | preflight, postflight, docs gate wiring |
| `FR-004` | `plan.md#3. Architecture` | `T002` | template marker checks |
| `FR-005` | `plan.md#7. Migration and Rollback` | `T003` | command surface validation |

## 10. Review Loop

| Round | Reviewer | Focus | Exit Criteria | Status |
| --- | --- | --- | --- | --- |
| `R1` | `aurora-plan-challenger` | Scope challenge | v34 applies only to command discipline, not full repo vendoring | Resolved |
| `R2` | `ada-qa-agent` | Gate quality | validator is wired into replayable scripts | Resolved |
| `R3` | `marcus-ai-orchestrator` | Go/no-go to execution | README, registry, workflows, and templates agree | Resolved |
