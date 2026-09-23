# Project Planning - School Operating Portal

Feature ID: `026-project-planning-school-operating-portal`

Recommended order:

1. Resolve `spec.md` clarifications.
2. Complete `research.md`, `data-model.md`, and `contracts/`.
3. Complete `plan.md` constitution gates.
4. Derive `tasks.md` ownership and parallel groups.
5. Build `execution-brief.md` from the package before `/develop`.
6. Implement tasks and record evidence in `verification.md`.
7. Do not begin execution until:
   - `python3 .agents/scripts/validate_specs.py --feature .agents/specs/026-project-planning-school-operating-portal` passes
   - `python3 .agents/scripts/validate_execution_readiness.py --root . --feature .agents/specs/026-project-planning-school-operating-portal` passes
