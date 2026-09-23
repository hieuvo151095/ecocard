# Quickstart: Superpowers Discipline Layer V34

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

## Expected Artifacts

- `scripts/validate_superpowers_discipline.py`
- updated harness gate scripts
- updated README, usage guide, and slash command registry
- updated main workflow files
- updated feature templates
- populated `specs/020-superpowers-discipline-layer-v34/`

## POC Rehearsal

The smallest credible POC is the validator itself:

1. Run the discipline validator at root.
2. Confirm it reports workflow and template markers present.
3. Run command-surface validation.
4. Confirm routecheck now includes the V34 discipline validator.

## Rollback Check

Rollback is local to `.agents` governance:

1. Remove calls to `validate_superpowers_discipline.py` from harness and
   readiness scripts.
2. Remove the routecheck registry and command-surface references.
3. Remove Superpowers V34 sections from workflows/templates.
4. Re-run command-surface validation to prove the old public surface is
   internally consistent.
