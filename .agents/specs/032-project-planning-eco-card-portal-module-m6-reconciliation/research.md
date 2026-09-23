# Research Notes: ECO Card Portal Module M6 (Đối soát)

> Feature ID: `032-project-planning-eco-card-portal-module-m6-reconciliation`

## Research Questions

- How do school groups and branches configure service tariffs across multiple billing periods?
- How does the system prevent rate mutations in past reconciliation sessions when contracts change?
- How is the zero-fee condition detected and guarded during session creation?

## Findings

| Topic | Finding | Source | Decision Impact |
| --- | --- | --- | --- |
| Tariff Snapshots | Sessions lock pricing configuration at creation time | `docs_legacy/00-master-index.md` | Enforced immutable JSON snapshotting in session schema |
| 0 VND Guard | Batch creation blocked if any branch calculates to 0 VND | `docs_legacy/m6-sm2-phien-doi-soat.md` | Added blocking guard MSG-01 in Step 3 of wizard |
| Multi-Service | Students using multiple services billed per service line | `docs_legacy/m6-sm2-phien-doi-soat.md` | Designed expandable sub-table in session detail |
| Arrears Sessions | Retroactive fees handled via child truy thu sessions | `docs_legacy/screenshots/sm2-phien-doi-soat-danh-sach.jpeg` | Designed nested child rows linked via parent session ID |

## Decisions Ready for Plan

- Adopt React 18 SPA with ECO Design System 1.0 tokens for pixel-accurate frontend rebuild.
- Encapsulate calculation and rounding logic into dedicated calculation service.
- Maintain immutable snapshot records for complete accounting auditability.
