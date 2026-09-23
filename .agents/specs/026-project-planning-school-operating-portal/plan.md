# Technical Implementation Plan: School Operating Portal

> Feature ID: `026-project-planning-school-operating-portal`  
> Status: Planning Complete  
> Governance: Marcus Fleet Constitution V1.0.0

---

## 1. Technical Summary

This plan outlines the engineering blueprint for rebuilding the three priority modules (Vận Hành, Học Tập, and Tài Chính) of the School Operating Portal. The solution combines Next.js Pages Router for multi-tenant web routing, Redux Toolkit for unified global state, Tailwind CSS with `styled-components` for the `ECO Design System 1.0` presentation layer, PHP / Laravel Sanctum for secure REST APIs, and Google Cloud Run with OpenResty for edge-routed multi-tenancy.

---

## 2. Constitution Gates

### Superpowers V34 Discipline Gates
- No placeholders rule: All planning specifications are concrete, fully grounded in legacy documents, and contain zero template placeholders.
- Root cause debugging: Any defects encountered during execution must be resolved at the root cause with verified regression tests.

- [x] Gate 1: Specification is the single source of truth — All features trace directly to `spec.md` and `docs_legacy/operating-portal/`.
- [x] Gate 2: Clarification before planning — All open questions around facial recognition queues, meal deductions, and tenant routing are resolved.
- [x] Gate 3: Contracts before code — API and data contracts are defined under `contracts/` and `data-model.md`.
- [x] Gate 4: Test-first verification — Verification methodology and test cases are established in `verification.md` before execution.
- [x] Gate 5: Security and tenant boundaries — NextAuth.js JWE encrypted session cookies and Laravel Sanctum bearer tokens enforce strict tenant isolation.
- [x] Gate 6: Simplicity gate — Standard framework capabilities are preferred without unnecessary architectural abstraction layers.

---

## 3. Architecture

```mermaid
graph TD
    Client[Browser Client] --> Proxy[OpenResty Reverse Proxy]
    Proxy -->|/{schoolCode}/...| Web[Next.js Pages Router Web App]
    Proxy -->|/{schoolCode}/api/1.0/...| API[Laravel 11 Headless API]
    Web -->|Redux Store / RTK Query| API
    API --> DB[(PostgreSQL Database)]
    API --> Queue[Cloud Run Background Worker]
    Queue --> Vision[Face Recognition Service]
```

The frontend application runs on Next.js Pages Router. Dynamic tenant prefixing is handled at the edge by OpenResty and routed to `pages/[schoolCode]/...`. Global state is orchestrated using Redux Toolkit, providing responsive client-side caching and optimistic UI updates for teacher actions.

---

## 4. Contracts

- `contracts/attendance-api.json`: Defines endpoints for daily roster query, check-in, check-out, authorized pickup guardian assignment, and bulk absence marking.
- `contracts/activity-api.json`: Defines endpoints for class activity publishing, media upload, hashtag lesson tagging, and moderation queues.
- `contracts/invoices-api.json`: Defines endpoints for bulk invoice generation, attendance-based meal deductions, VietQR code rendering, and payment webhook processing.
- `contracts/assignments-api.json`: Defines endpoints for homework distribution and student submission tracking.

---

## 5. Data Model

The data layer is modeled in relational entities mapped in `data-model.md`:
- `School`, `Class`, `Student`, `Guardian`
- `Attendance`, `Activity`, `Album`, `MediaItem`, `FaceTag`
- `Timetable`, `Assignment`, `Submission`, `GradebookEntry`
- `FeeCatalogItem`, `ClassFeeSchedule`, `Invoice`, `InvoiceItem`, `ExpenseVoucher`, `ReconciliationSession`

---

## 6. Agent Routing

- Frontend Architecture & State: `alan-tech-lead`
- Component Construction & UI Design System: `benny-frontend-engineer`
- Systems Architecture & API Contracts: `david-systems-architect`
- Quality Assurance & End-to-End Test Suite: `ada-qa-agent`

---

## 7. Migration and Rollback

- **Zero-Downtime Deployment:** Frontend and API services deploy as independent Cloud Run revisions fronted by OpenResty routing.
- **Rollback Strategy:** If a regression is detected in production, traffic can be instantly rolled back to the prior Cloud Run revision tag using `gcloud run services update-traffic` in under 5 seconds.
- **Data Backwards Compatibility:** All database migrations are backward-compatible, introducing additive columns rather than destructive alterations.

---

## 8. Complexity Tracking

The primary architectural complexity stems from cross-module integration between daily attendance absence logs and monthly billing calculations. This complexity is isolated inside a dedicated backend billing calculation service rather than distributed across client-side views.

---

## 9. POC Slice and Review Cadence

- **POC slice boundary:** Build the daily per-class attendance roster (`/class/[classId]/attendance`) demonstrating single-click check-in, check-out validation with error toast MSG01, pickup guardian modal, and instant counter recalculation.
- **Success evidence for the slice:** Automated Playwright test verifying that clicking Đón updates the presence counter, and clicking Trả with an invalid time triggers error message `Giờ trả học sinh phải lớn hơn giờ đón học sinh`.
- **Stop conditions:** If check-in state update takes longer than 200ms on the client or validation rules fail to reject invalid timestamps.
- **Proceed conditions:** Complete pass of all positive and negative attendance test assertions and visual validation against `ECO Design System 1.0`.
