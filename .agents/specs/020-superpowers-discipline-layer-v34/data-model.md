# Data Model: Superpowers Discipline Layer V34

No product database entities are introduced.

## Validator Marker Contract

| Entity | Fields | Lifecycle |
| --- | --- | --- |
| Workflow marker rule | relative workflow path, required marker phrases | maintained in `validate_superpowers_discipline.py` |
| Template marker rule | relative template path, required marker phrases | maintained with template changes |
| Feature marker rule | generated feature file, required marker phrases | checked during execution readiness |
| Validation error | file path, missing marker | printed to terminal and used as gate evidence |

## Retention

Marker rules live in source control. Validation output is transient unless
captured in `.agents/logs/harness/*.jsonl` by preflight or postflight wrappers.

## Compatibility

The marker contract is additive. It does not change TrustGraph, MCP, product
data, or application runtime schemas.
