---
id: development-index
type: development-index
status: in-progress
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/prd.md
  - docs/tasks.md
  - docs/planning/flows.md
  - docs/planning/screens.md
  - docs/planning/diagrams.md
---

# Development Knowledge Index

This index provides a comprehensive operational overview of the ECO Card Portal Module M6 (Đối soát) implementation state. It documents the active architecture, canonical IDs, data boundaries, and verification gates across both sub-modules: Sub-Module 1 (Cấu hình đối soát) and Sub-Module 2 (Phiên đối soát).

## Execution Scope

- Feature/spec id: `032-project-planning-eco-card-portal-module-m6-reconciliation`
- Implementation branch: `main`
- Approved planning package: `.agents/specs/032-project-planning-eco-card-portal-module-m6-reconciliation/`
- Active owner skills: `sophia-product-manager`, `benny-frontend-engineer`, `david-systems-architect`, `alan-tech-lead`, `ada-qa-agent`

## Artifact Map

| Artifact | Path | Purpose |
| --- | --- | --- |
| Manifest | `docs/development/development_manifest.json` | Canonical registry for topology, IDs, quality gates, and epic children |
| Epic Root | `docs/development/E-001-m6-reconciliation/` | Parent folder for Module M6 reconciliation delivery outcome |
| Epic Note | `docs/development/E-001-m6-reconciliation/epic.md` | Major reconciliation settlement outcome and acceptance boundary |
| Issues | `docs/development/E-001-m6-reconciliation/issues.md` | QA and product risk register for reconciliation billing |
| Features | `docs/development/E-001-m6-reconciliation/features/F-001-001-m6-reconciliation.md` | User-visible behavior and implementation slices for SM1 and SM2 |
| Modules | `docs/development/E-001-m6-reconciliation/modules/M-001-001-m6-reconciliation.md` | Architecture, data models, calculator engine, and state machines |
| Pages | `docs/development/E-001-m6-reconciliation/pages/P-001-001-m6-reconciliation.md` | UI routes, drawer drawers, modal wizards, tabs, and screen layouts |
| Tasks | `docs/development/E-001-m6-reconciliation/tasks/T-001-001-001-m6-reconciliation.md` | Execution notes, verification commands, and residual risks |
| Sync | `docs/development/E-001-m6-reconciliation/sync/` | Epic-local code and documentation sync audit notes |

## Canonical ID Registry

| ID | Type | Parent | Status | File |
| --- | --- | --- | --- | --- |
| `E-001-m6-reconciliation` | epic | root | in-progress | `docs/development/E-001-m6-reconciliation/epic.md` |
| `ISSUES-E-001-m6-reconciliation` | epic-issues | `E-001-m6-reconciliation` | active | `docs/development/E-001-m6-reconciliation/issues.md` |
| `F-001-001-m6-reconciliation` | feature | `E-001-m6-reconciliation` | in-progress | `docs/development/E-001-m6-reconciliation/features/F-001-001-m6-reconciliation.md` |
| `M-001-001-m6-reconciliation` | module | `E-001-m6-reconciliation` | in-progress | `docs/development/E-001-m6-reconciliation/modules/M-001-001-m6-reconciliation.md` |
| `P-001-001-m6-reconciliation` | page | `E-001-m6-reconciliation` | in-progress | `docs/development/E-001-m6-reconciliation/pages/P-001-001-m6-reconciliation.md` |
| `T-001-001-001-m6-reconciliation` | task | `E-001-m6-reconciliation` | in-progress | `docs/development/E-001-m6-reconciliation/tasks/T-001-001-001-m6-reconciliation.md` |

## Relationship Label Taxonomy

| Label | Meaning | Use When |
| --- | --- | --- |
| `DEPENDS_ON` | Source artifact cannot work without target | Feature needs module, page needs data contract |
| `BLOCKS` | Source must finish before target can proceed | Task sequencing or unresolved issue blocks release |
| `ENABLES` | Source unlocks target capability | Module/epic enables feature or demo |
| `IMPLEMENTS` | Source realizes target requirement | Feature implements epic, task implements story |
| `USES` | Source consumes target behavior/data | Page uses module, task edits module |
| `EXTENDS` | Source adds behavior on top of target | Feature extends an existing feature |
| `CONFLICTS_WITH` | Source may overlap or break target | Competing UX/state/data choices |
| `SUPERSEDES` | Source replaces an older behavior/doc decision | Updated design or implementation decision |
| `DUPLICATES` | Source appears to repeat target | Migration/audit duplicate detection |
| `RELATES_TO` | Source has non-blocking contextual relation | Shared user journey, shared data, adjacent feature |

## Jira / Product Governance

- Story format: User story with actor, capability, business outcome, and verification criteria
- Priority model: `P0` (Critical blocker), `P1` (Core workflow), `P2` (Feature enhancement), `P3` (Edge case polish), `P4` (Cosmetic)
- Issue source: QA auto-detect, visual inspection against 17 screenshot artifacts, regression test
- Docs-before-code status: Fully synchronized across planning suite and development ledger
- Last deep research source reviewed: `docs_legacy/m6-sm1-cau-hinh-doi-soat.md` and `docs_legacy/m6-sm2-phien-doi-soat.md`

## Migration / Archive Notes

- Legacy flat buckets: Migrated to canonical epic-first hierarchy `docs/development/E-001-m6-reconciliation/`
- Duplicate files archived: None; fresh implementation workspace initialized
- Files intentionally retained: All 17 screenshot references in `docs_legacy/screenshots/` as visual truth
- Files requiring manual PM review: None; planning approved for development execution

## Verification Summary

- Unit tests: Automated calculation engine tests for active student conversion, surplus day rounding, and zero-fee guard
- Integration tests: Complete lifecycle state machine tests from Nháp to Chờ duyệt, Đã duyệt, Đã gửi trường, and Đã thanh toán
- UI/E2E tests: Component rendering audits and pixel fidelity checks against legacy screenshots
- Build/lint/typecheck: Clean build passing Vite bundler and TailwindCSS compilation
- Manual checks: Verification of 3-step wizard, drawer slide-overs, period schedule generation, and nested truy thu sessions

## Open Risks

- Risk: High student cohort size could induce calculation latency during live Step 3 scanning preview
  - Owner: `alan-tech-lead`
  - Mitigation: Cache student counts per branch and debounce cut-off date recalculations
- Risk: Rate mutation could retroactively distort historical settled financial statements
  - Owner: `david-systems-architect`
  - Mitigation: Enforce immutable snapshotting ADR-M6-001 freezing tariff rates into session records

## Documentation Freshness

- Last code slice synced: Initial development ledger bootstrap and project foundation setup
- Last sync note: `docs/development/E-001-m6-reconciliation/sync/2026-09-23-initial-bootstrap.md`
- Docs intentionally stale: None; full parity maintained
- Next documentation action: Record implementation slice sync note upon frontend shell and domain engine completion
