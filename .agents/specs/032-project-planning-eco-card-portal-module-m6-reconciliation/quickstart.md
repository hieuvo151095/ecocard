# Quickstart Validation: ECO Card Portal Module M6 (Đối soát)

> Feature ID: `032-project-planning-eco-card-portal-module-m6-reconciliation`

## Local Preconditions

- Required services: Node.js runtime (v18+) and browser environment.
- Required environment variables: None (uses client-side mock store with local storage persistence).
- Required commands: `npm run dev` to launch portal preview.

## Validation Path

1. Run:
   ```bash
   python3 .agents/scripts/run_required_docs_gates.py --root . --mode planning
   ```
2. Confirm:
   ```text
   REQUIRED DOCS GATES PASSED
   ```

## Expected Artifacts

- Files, logs, screenshots, or documents that should exist after validation:
  - All 8 legacy planning outputs under `docs/` (`prd.md`, `tasks.md`, `knowledge.md`, `decisions.md`, `memory.md`, `flows.md`, `screens.md`, `diagrams.md`).
  - All 5 research ledger files under `docs/research/`.
- Docs or ledger notes that must be updated before declaring completion:
  - `agents.md` root memory entry.
  - `docs/verification.md` with final gate outputs.

## POC Rehearsal

- Smallest end-to-end path to demonstrate:
  - Load SM1 master list, expand school branch rows, open create group drawer.
  - Load SM2 session wizard, trigger live student calculation preview, and verify the 0 VND guard alert.
- Evidence to capture during rehearsal:
  - Console verification logs of calculation engine and snapshot serialization.
  - Side-by-side screenshot comparisons against `docs_legacy/screenshots/`.
- Criteria to stop and revise docs before broader execution:
  - Any mismatch in financial formula calculation or missing design tokens.

## Rollback Check

- Draft sessions can be cancelled via `Hủy phiên`, triggering immediate release of student calculation holds.
- Non-breaking UI updates are isolated to module components without affecting system core.
