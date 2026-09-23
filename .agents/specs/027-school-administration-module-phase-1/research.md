# Research Notes: School Administration Module Phase 1

> Feature ID: `027-school-administration-module-phase-1`

## Research Questions

- How do student class transfers affect tuition invoicing, parent communications, and grade evaluations?
- What are the operational differences between regular curricular classes and extracurricular classes?
- How is teacher content moderation enforced between head teachers and assistants?
- Why did the legacy grade level search API fail and how can it be permanently rectified?

## Findings

| Topic | Finding | Source | Decision Impact |
| --- | --- | --- | --- |
| Student Transfers | Class transitions require 3 automated cascades: remapping fee schedules, updating group chat permissions, and pruning non-aligned evaluations. | `docs_legacy/operating-portal/nha-truong/hoc-sinh.md` | Formalized in ADR-009; modal displays mandatory 3-point system warning. |
| Extracurricular Classes | Extracurricular classes only support attendance, activities, and photo albums; they strictly omit tuition schedules, gradebooks, and subject allocation. | `docs_legacy/operating-portal/nha-truong/lop-hoc.md` | Dual class taxonomy established with explicit feature degeneration. |
| Teacher Moderation | "Giáo viên chính" posts are auto-published; "Giáo viên hỗ trợ" posts require administrative approval in the moderation queue. | `docs_legacy/operating-portal/nha-truong/giao-vien.md` | Role permission flags in `teacherSlice` route activity creations. |
| Grade Level Search Defect | Legacy server search endpoint drops records when query `q` is provided and fails to reload when cleared. | `docs_legacy/operating-portal/nha-truong/khoi-lop.md` | Client-side reactive substring filtering implemented over the in-memory grade dataset with instant restoration on clear. |

## Decisions Ready for Plan

- Enforce zero-student class deletion invariant (`studentCount === 0`).
- Implement 360° Student Detail Hub with reused contextual tabs for Activities, Media, Attendance, and Invoices.
- Support multi-parent cards with cross-sibling account linking.
- Calculate BMI automatically: `weight / (height / 100)^2`.
- Deduplicate teacher allocation dropdowns in Subject catalog.
