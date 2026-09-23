# Feature Specification: School Teachers Directory (Nhà Trường — Giáo Viên)

> Feature ID: `030-school-teachers-directory`
> Created: `2026-09-21`
> Status: Approved Design Specification
> Source Prompt: Stakeholder Design Review and Compliance Audit for Sub-module Giáo Viên (Teachers) under NHÀ TRƯỜNG module
> Epic Reference: `E-016-school-teachers`

## 1. Purpose

The School Teachers Sub-Module ("Nhà Trường — Giáo Viên") establishes institutional governance for the entire instructional faculty of the School Operating Portal (`/school/teacher/`). It manages teacher directories, role permissions, homeroom and subject teaching assignments, credential lifecycle, and content moderation boundaries.

This feature delivers complete operational oversight:
1. **Teacher Directory:** Multi-factor search across 5 fields (Name, Staff Code, Email, Phone, CCCD) with status overview metrics.
2. **Two-Tier Content Moderation (BR01):** Differentiates "Giáo viên chính" (auto-publishes class updates and photo albums directly to parents) from "Giáo viên hỗ trợ" (activity updates routed to administrative moderation queue `cho_duyet`).
3. **Class Assignment & Conflict Detection (Resolution K006):** Homeroom teacher (GVCN) and subject teaching class assignments with real-time amber conflict detection when a selected class already has an existing homeroom teacher.
4. **Credential & Email Governance (BR06):** Email change dialog with current email display, regex validation, and duplicate account prevention.
5. **Graceful Legacy Record Handling (Resolution K008):** Italic fallback styling (`Chưa có mã GV`, `Chưa có CCCD`) preventing table breakage or runtime errors for legacy unmigrated records.
6. **Onboarding & Dirty State Protection (Resolution K010):** Teacher creation wizard (`/school/teacher/create/`) enforcing mandatory fields and dirty form abandonment protection.
7. **Comprehensive Profile Detail Hub (`/school/teacher/info/[id]/`):** Master faculty profile exhibiting credentials, contact details, assigned classes, and BR01 moderation notices.

## 2. User Stories

- [x] As a School Administrator, I need a centralized teacher directory so that I can search and filter faculty across classes, permission tiers, and employment status.
- [x] As a School Administrator, I need to assign homeroom and teaching classes to faculty with automated conflict warnings so that duplicate homeroom assignments are prevented.
- [x] As a School Administrator, I need to govern teacher content permissions ("Giáo viên chính" vs "Giáo viên hỗ trợ") so that assistant teachers' parent posts undergo administrative review.
- [x] As a School Administrator, I need to update teacher login emails and reset credentials securely so that faculty account access remains current.
- [x] As a School Administrator, I need dirty form protection on teacher creation so that typed onboarding data is not accidentally lost on navigation.

## 3. Functional Requirements

- `FR-001`: The system MUST provide a teacher directory (`/school/teacher/`) filterable by class, permission tier, status, keyword search across 5 fields, and CSDL Sở GD&ĐT flag.
- `FR-002`: The system MUST enforce two-tier content moderation permissions: `Giáo viên chính` (auto-publish) vs `Giáo viên hỗ trợ` (queued for review `cho_duyet`).
- `FR-003`: The system MUST provide a class assignment modal (`AssignClassModal`) that detects homeroom conflicts in real-time and displays an amber alert banner (Resolution K006).
- `FR-004`: The system MUST provide an email change modal (`ChangeEmailModal`) validating email syntax and checking against existing accounts.
- `FR-005`: The system MUST provide a teacher deletion modal (`DeleteTeacherModal`) warning about unassigning classes and revoking login access.
- `FR-006`: The system MUST display graceful italic fallback text (`Chưa có mã GV`, `Chưa có CCCD`) for legacy records lacking optional credentials (Resolution K008).
- `FR-007`: The system MUST provide a teacher onboarding page (`/school/teacher/create/`) with dirty form abandonment confirmation modal (Resolution K010).
- `FR-008`: The system MUST provide a teacher profile hub (`/school/teacher/info/[id]/`) presenting basic info, teaching classes, qualifications, and BR01 moderation notices.

## 4. Non-Functional Requirements

- `NFR-001`: Performance: Teacher directory must render within 300ms; client-side multi-factor search must respond in $< 50$ms.
- `NFR-002`: Security: Teacher credentials must be encrypted; email modifications require confirmation.
- `NFR-003`: Observability: Critical actions (class reassignment, email change, deletion) dispatch audit log events.
- `NFR-004`: Accessibility: All modals, action dropdowns, and form fields must meet WCAG 2.1 AA contrast standards.
- `NFR-005`: Design System Token Compliance: 100% adherence to ECO Design System 1.0 tokens.

## 5. Acceptance Criteria

- `AC-001`: Directory table displays avatar, staff code, full name, homeroom class, assigned teaching classes, phone, email, permission badge, and `•••` action dropdown.
- `AC-002`: Action dropdown (`•••`) features upward flip behavior when opened near the viewport bottom.
- `AC-003`: In `AssignClassModal`, selecting a homeroom class that already has a GVCN renders an amber conflict warning banner identifying the current teacher.
- `AC-004`: In `ChangeEmailModal`, typing an invalid email disables save button; submitting valid email updates Redux and dispatches a success toast.
- `AC-005`: Onboarding form detects dirty changes and blocks cancel/navigation with a confirmation dialog.

## 6. Clarifications

- None pending; all business rules verified against `docs_legacy/operating-portal/nha-truong/giao-vien.md` and `E-016-school-teachers`.

## 7. Constraints

- Zero unapproved color hexes outside ECO Design System 1.0 palette.
- Strict sentence-case headers across all table rosters.

## 8. Risks

- Homeroom reassignment without notification: Resolved by K006 explicit confirmation banner.

## 9. Traceability

- Legacy Spec: `docs_legacy/operating-portal/nha-truong/giao-vien.md`
- Epic: `docs/development/E-016-school-teachers/epic.md`
- Task: `docs/tasks.md` (`TASK-SCH-002`)
- Unit Tests: `tests/unit/teachers.test.mjs` (29/29 passing)

## 10. Review Loop

- Validated with PO Sophia Butler, BA Guild, Maya & Aris (UI/UX), Alan (Tech Lead), and Eve (QA).
