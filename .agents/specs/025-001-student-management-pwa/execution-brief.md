# Execution Brief: Student Management PWA (POC)

> Feature ID: `025-001-student-management-pwa`
> Task Shape: `Standard Web App POC`
> Generated From: `spec.md`, `plan.md`, `tasks.md`, `verification.md`, `quickstart.md`, `agent-routing.md`

## 1. Operator Intent Snapshot

Develop an interactive Student Management Mobile Web PWA (Proof of Concept) focusing on Student/Parent view for daily attendance tracking and 2-semester academic grade reports. On desktop browsers (width >= 768px), wrap the application in an iPhone 16 Pro Simulator frame with Dynamic Island and status bar. On mobile devices (width < 768px), display full-screen natively.

## 2. Required Behavior

- Attendance screen displays overall attendance percentage, monthly calendar, and filterable log list (Tháng 9 to Tháng 5).
- Grade report screen provides 3 tabs: `Học kỳ 1`, `Học kỳ 2`, and `Cả năm`, presenting regular, midterm, final, and subject average scores for 8 subjects.
- Desktop view wraps UI inside an iPhone 16 Pro chassis; mobile view displays 100% native viewport.
- UI styling follows a strict Modern Dark Monochromatic palette (Zinc-950/900/800), sans-serif typography (Inter/Outfit), and Lucide SVG line icons.

## 3. Scope Boundaries

- Included: PWA web app manifest, offline service worker caching, mock JSON data fixtures, interactive UI tabs.
- Out of scope: Live backend API servers, SQL database persistence, teacher multi-tenant entry portal.

## 4. Active Work Slice

- Core slice: Frontend layout (`index.html`, `index.css`), simulator frame wrapper (`SimulatorFrame.js`), navigation tab bar (`Navigation.js`), Attendance page (`AttendancePage.js`), Grade Report page (`GradesPage.js`), mock fixtures (`mockData.js`).

## 5. Development Ledger Context

- Design tokens defined in `docs/knowledge.md`.
- Architecture & sequence flows defined in `docs/planning/flows.md` and `docs/planning/diagrams.md`.
- ADR decisions recorded in `docs/decisions.md`.

## 6. Verification Path

- Run `python3 -m http.server 8080` and open `http://localhost:8080`.
- Verify desktop iPhone 16 Pro simulator frame rendering.
- Verify attendance month filter (T9-T5) and 2-semester grade switching (HK1, HK2, Cả năm).

## 7. Review and Release Signals

- Spec compliance: Approved (`aurora-plan-challenger`).
- Architecture review: Approved (`david-systems-architect`).
- Release recommendation: `GO`.

## 7.1 Superpowers Discipline Snapshot

- clarification status: All user role, theme, and simulator questions resolved.
- TDD or accepted exception: Accepted frontend UI rendering TDD exception.
- Root cause status for bugfix work: N/A (Feature Greenfield).
- Review order: spec compliance before code quality.
- Completion claim gate: fresh verification required before success language.

## 8. Context Expansion Rules

Inspect local spec files and design system tokens before modifying CSS layout.

### Task Shape Decision

Single-phase frontend web application engineering slice.

### Required Reads

- `.agents/specs/025-001-student-management-pwa/spec.md`
- `.agents/specs/025-001-student-management-pwa/plan.md`
- `docs/knowledge.md`

### Forbidden Default Reads

- Unrelated historical spec folders.

### Expansion Triggers

- Expand to mobile touch gesture handling if browser testing reveals tap latency.
