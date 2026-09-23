# Superpowers Discipline Layer V34

Feature ID: `020-superpowers-discipline-layer-v34`

Recommended order:

1. Resolve `spec.md` clarifications.
2. Complete `research.md`, `data-model.md`, and `contracts/`.
3. Complete `plan.md` constitution gates.
4. Derive `tasks.md` ownership and parallel groups.
5. Build `execution-brief.md` from the package before `/develop`.
6. Implement tasks and record evidence in `verification.md`.
7. Do not begin execution until:
   - `python3 .agents/scripts/validate_specs.py --feature .agents/specs/020-superpowers-discipline-layer-v34` passes
   - `python3 .agents/scripts/validate_execution_readiness.py --root . --feature .agents/specs/020-superpowers-discipline-layer-v34` passes
