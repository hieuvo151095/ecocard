# Feature Specification: Student Management PWA (POC)

> Feature ID: `025-001-student-management-pwa`
> Created: `2026-08-19`
> Status: Draft
> Source Prompt: Phần mềm quản lý học sinh trên điện thoại Web PWA POC điểm danh và xem điểm 2 kỳ

## 1. Purpose

The objective of this feature is to deliver a mobile-first Progressive Web Application (PWA) Proof of Concept (POC) tailored for students and parents. This application enables real-time visual inspection of daily attendance records and a 2-semester academic grade breakdown. When accessed on desktop browsers, the application is presented inside an interactive iPhone 16 Pro Simulator frame to simulate a real mobile device presentation, automatically switching to full native viewport on mobile screens.

## 2. User Stories

- [x] As a Student/Parent, I need an attendance tracking screen so that I can inspect daily attendance status (Có mặt, Vắng có phép, Vắng không phép) and monthly statistics.
- [x] As a Student/Parent, I need a 2-semester grade breakdown screen so that I can toggle between Học kỳ 1, Học kỳ 2, and Cả năm to track subject scores and overall GPA.
- [x] As an internal operator or demo presenter, I need a desktop iPhone 16 Pro simulator frame wrapper so that the web application renders as a polished mobile presentation on desktop monitors while rendering natively on mobile devices.

## 3. Functional Requirements

- `FR-001`: The system MUST provide an Attendance Tracking module displaying overall attendance rate percentage, attendance scorecard totals, an interactive month filter (Tháng 9 to Tháng 5), and a detailed timeline log.
- `FR-002`: The system MUST provide a 2-Semester Grade Report module with tab switching between `Học kỳ 1`, `Học kỳ 2`, and `Cả năm`, presenting subject grade breakdown (Thường xuyên, Giữa kỳ, Cuối kỳ, TB Môn) for 8 core subjects.
- `FR-003`: The system MUST provide a responsive iPhone 16 Pro simulator frame wrapper (featuring Dynamic Island, status bar clock/battery, home indicator bar) when viewed on viewports width >= 768px, and automatically bypass the simulator frame on viewports width < 768px.
- `FR-004`: The system MUST implement a strict Modern Dark Monochromatic design system (Zinc-950, Zinc-900, Zinc-800) with sans-serif typography (Inter/Outfit) and unified Lucide SVG line icons.
- `FR-005`: The system MUST provide PWA capabilities including a Web App Manifest and Service Worker caching strategy for offline loading.

## 4. Non-Functional Requirements

- `NFR-001`: Performance: All tab switching and filter interactions must complete within 100ms without full page reload.
- `NFR-002`: Security: Client-side storage of mock student profile data must remain strictly isolated within local browser storage.
- `NFR-003`: Observability: Console errors and state transitions must be logged in clear JSON format during runtime debug mode.
- `NFR-004`: Maintainability: UI components and mock fixtures must remain decoupled and follow clean modular JavaScript design patterns.
- `NFR-005`: Documentation and traceability: All requirements must trace directly to test verification cases in `verification.md`.

## 5. Acceptance Criteria

- `AC-001`: Given the user navigates to the "Điểm danh" tab, when they select a month (e.g. "Tháng 10"), then the attendance calendar and log list update to show October records.
- `AC-002`: Given the user navigates to the "Bảng điểm" tab, when they click "Học kỳ 2", then the subject cards update to display Semester 2 regular, midterm, and final exam scores.
- `AC-003`: Given the application is opened on a desktop browser with width >= 768px, when the page loads, then the app content is centered inside an iPhone 16 Pro chassis with Dynamic Island and status bar.
- `AC-004`: Given the application is opened on a mobile device with width < 768px, when the page loads, then the iPhone chassis frame is hidden and the app occupies 100% of the screen.

## 6. Clarifications

### Superpowers V34: Question Back Protocol

All primary user intent and platform scope questions were clarified directly with the operator.

### Clarification Ledger

| Question | Why It Matters | Answer or Accepted Risk | Status |
| --- | --- | --- | --- |
| What is the target user role for the POC? | Focuses user flows and UI capabilities. | Student/Parent View (Attendance & 2-Semester Grade Reports) | Closed |
| What design theme & typography is preferred? | Establishes design tokens. | Modern Dark Monochrome (Zinc/Slate, Inter/Outfit sans-serif) | Closed |
| What simulator chassis style for desktop? | Sets frame rendering rules. | iPhone 16 Pro Simulator (Dynamic Island, status bar, home indicator) | Closed |

## 7. Constraints

- Constitution articles that apply: Article I (Spec Source of Truth), Article IV (Test-First Verification), Article V (Execution Boundaries), Article IX (Execution Readiness).
- Existing files or modules in scope: `index.html`, `index.css`, `src/`.
- Files or modules out of scope: Live backend servers, SQL databases, multi-tenant authentication systems.
- Compatibility requirements: Works on modern Chrome, Safari, Firefox, and mobile Safari/Chrome browsers.
- Documentation prerequisites already reviewed: `.agents/memory/constitution.md`.
- Rollback or containment expectations: Local git commit rollback path.

Out of scope:

- Backend REST API integration (Driven by client-side mock fixtures).
- Multi-school administration dashboards.
- SMS/Email notification dispatch servers.

## 8. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Desktop window resize causing layout jump | Low | Use CSS media queries and JS resize listeners for smooth transition |
| Monochromatic color lack of visual contrast | Medium | Use Zinc-100 high contrast text and Lucide SVG status icons |
| PWA service worker caching stale assets | Low | Include cache versioning in `sw.js` |

## 9. Traceability

| Requirement | Plan Section | Tasks | Verification |
| --- | --- | --- | --- |
| `FR-001` | Section 3.2 | `TASK-005` | `AC-001` |
| `FR-002` | Section 3.2 | `TASK-006` | `AC-002` |
| `FR-003` | Section 3.1 | `TASK-002` | `AC-003`, `AC-004` |
| `FR-004` | Section 3.1 | `TASK-001` | Visual Token Audit |
| `FR-005` | Section 3.2 | `TASK-008` | PWA DevTools Check |

## 10. Review Loop

| Round | Reviewer | Focus | Exit Criteria | Status |
| --- | --- | --- | --- | --- |
| `R1` | `aurora-plan-challenger` | Scope challenge | Unclear scope removed, risks surfaced | Approved |
| `R2` | `sophia-product-manager` | Requirement quality | Acceptance criteria complete | Approved |
| `R3` | `marcus-ai-orchestrator` | Go/no-go to planning | Spec package is stable | Approved |
