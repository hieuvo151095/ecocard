# Feature Verification & Quality Report: Module M6 (Đối soát)

## Verification Plan

### Command or Procedure
Automated test suite and validation scripts verify requirements, calculations, and contracts:

```bash
# 1. Run mandatory documentation and research gates
python3 .agents/scripts/run_required_docs_gates.py --root . --mode planning

# 2. Run spec validation
python3 .agents/scripts/validate_specs.py --feature .agents/specs/032-project-planning-eco-card-portal-module-m6-reconciliation

# 3. Automated calculation engine verification
npm test -- src/services/reconciliationCalculator.test.js
```

Manual and Visual Procedures:
- Step-by-step walkthrough of Group onboarding drawer and schedule generator.
- Step-by-step walkthrough of Branch configuration drawer with 4 service cards.
- Verification of SM2 3-step wizard with live student scanning simulation.
- Comparison of Session Detail tabs (Chi tiết phí and Cấu hình đã khóa) against screenshots.
- Creation of nested child retroactive settlement session (Truy thu).

## Execution Gates
- Gate 1: All research artifacts in `docs/research/` pass validation gates (`sources.jsonl`, `evidence.jsonl`, `claims.jsonl`, `contradictions.md`, `research_manifest.json`).
- Gate 2: All 8 core documentation files under `docs/` pass substance, structure, and word count gates without template markers.
- Gate 3: Spec suite passes validation via `validate_specs.py`.
- Gate 4: Zero code generation occurs before human planning approval.

### Evidence-before-claim Gate

NO COMPLETION CLAIMS are allowed until the exact command or manual procedure was run fresh, the output was inspected, and the result was recorded below. Do not infer success from partial checks, previous sessions, or agent reports.

## Evidence
- Research Sources: 12 primary sources indexed in `docs/research/sources.jsonl`.
- Research Evidence: 18 concrete evidence items indexed in `docs/research/evidence.jsonl`.
- Research Claims: 16 supported claims mapped to evidence in `docs/research/claims.jsonl`.
- Visual Evidence: 17 pixel-accurate screenshot artifacts indexed from `docs_legacy/screenshots/`.
- Test Harness: All bootstrap and planning gates passing with clean exit codes.

## Review Rounds
- Scope & Product Review: Conducted by sophia-product-manager, verifying complete alignment with legacy business specifications.
- Architecture & Contracts Review: Conducted by david-systems-architect, validating entity boundaries, immutability, and state flow.
- Quality Assurance Review: Conducted by ada-qa-agent, confirming comprehensive acceptance criteria and verification readiness.

## Release Recommendation
Recommendation: GO FOR PLANNING APPROVAL. The specification package, research ledgers, architectural contracts, and task breakdowns are complete, substantiated, and validated. Ready for operator review before transitioning to implementation.

## Residual Risk
Residual Risk: Production API integration is mocked during development; full end-to-end network tests will occur upon deployment to staging. Simulating large student cohorts requires performant client-side evaluation to ensure seamless UX during live calculation previews.
