# Feature Specification: ECO Card Portal Module M6 (Đối soát)

## 1. Purpose
The purpose of this feature is to rebuild Module M6 (Đối soát) of the ECO Card Portal, encompassing Sub-Module 1 (Cấu hình đối soát) and Sub-Module 2 (Phiên đối soát). The system automates periodic billing calculations, enforces immutable configuration snapshotting at session creation, prevents zero-fee billing sessions, and coordinates the full lifecycle from draft creation to managerial approval, school notification, and retroactive arrears settlement.

## 2. User Stories
- As an Operations Administrator, I want to configure school groups, billing calendars, and per-branch service tariffs so that school contracts are accurately represented for periodic reconciliation.
- As a Finance Officer, I want to create reconciliation sessions through a 3-step wizard with live student scanning preview so that I can inspect billable figures before locking the session.
- As a Finance Lead, I want to review submitted sessions, inspect itemized fee breakdowns, and approve statements for transmission to schools.
- As an Auditor, I want each reconciliation session to freeze an immutable snapshot of tariff rates at creation time so that future contract modifications never alter past settlements.

## 3. Functional Requirements
- `FR-001`: School Group management with unique immutable group code, legal entity fields, settlement scope (Theo nhóm trường or Theo từng trường), and up to 3 recipient emails.
- `FR-002`: Multi-period billing calendar engine supporting automated schedule generation (Sinh lịch kỳ) and individual period fee collection toggling.
- `FR-003`: Calculation threshold configuration specifying minimum active student months and surplus day rounding rules.
- `FR-004`: School branch assignment with enrolled student count, 4 service toggles (Phần mềm quản lý, Camera AI, Thẻ học sinh, Căn tin), and per-period unit prices.
- `FR-005`: 3-step session creation wizard (Select Group/Branches -> Select Period & Cut-Off Date -> Student Scan Preview).
- `FR-006`: Zero-fee blocker guard preventing session creation if any selected branch has a calculated fee of 0 VND (MSG-01).
- `FR-007`: Immutable configuration snapshotting locking pricing rules into the session entity upon creation.
- `FR-008`: Complete lifecycle state machine (Nháp -> Chờ duyệt -> Đã duyệt -> Đã gửi trường -> Đã thanh toán, with Hủy phiên allowed in Nháp).
- `FR-009`: Nested child retroactive settlement sessions (Phiên truy thu) launched from paid parent sessions.

## 4. Non-Functional Requirements
- NFR-01: Full Vietnamese localization matching banking and educational accounting terminology.
- NFR-02: Currency formatted as Vietnamese Dong (e.g. 1.008.000đ) and dates formatted as DD/MM/YYYY.
- NFR-03: Strict compliance with ECO Design System 1.0 tokens (Primary Blue #0070CE, Brand Yellow #FEC020).
- NFR-04: Live student calculation preview completes in under 1.5 seconds with responsive loading feedback.

## 5. Acceptance Criteria
- `AC-001`: Creating a school group successfully establishes periods and active thresholds, displaying in the master list.
- `AC-002`: Expanding a school group row renders the nested branches table with active service indicators and edit actions.
- `AC-003`: Step 3 of session creation blocks submission with an amber alert if any branch calculates to 0 VND.
- `AC-004`: Created sessions lock a frozen snapshot tab displaying effective tariffs independent of future SM1 edits.
- `AC-005`: Sessions advance through lifecycle states with contextual action button updates.
- `AC-006`: Paid sessions allow launching nested child truy thu sessions displayed under the parent row.

## 6. Clarifications

### Superpowers V34: Question Back Protocol

Before planning, ask back when any answer can change scope, user behavior, security posture, data ownership, rollback, verification, or cost. Each question must name the decision it protects.

### Clarification Ledger

| Question | Why It Matters | Answer or Accepted Risk | Status |
| --- | --- | --- | --- |
| What role model should be implemented? | Governs access control and approval flows. | Ops Admin, Finance Officer, and Finance Approver roles with in-app switcher. | Resolved |
| How to handle duplicate active sessions for the same period? | Prevents double billing. | Hard-blocked; periods with existing active sessions cannot spawn new ones. | Resolved |
| How is payment recorded? | Finalizes billing settlement lifecycle. | Explicit Finance action transitions Đã gửi trường to Đã thanh toán. | Resolved |
| What does status Đã nhả kết quả represent? | Audit transparency on cancellation. | Holds on active student calculations are released back to unbilled pool. | Resolved |

- Clarification 01: Role permissions model Ops Admin, Finance Officer, and Finance Approver capabilities, supporting role toggling during development.
- Clarification 02: Periods with existing non-cancelled sessions are strictly prevented from spawning duplicate active sessions.
- Clarification 03: Payment recording from Đã gửi trường to Đã thanh toán is provided as an explicit Finance action.
- Clarification 04: The label Đã nhả kết quả indicates the operational release of student active calculation holds upon session cancellation.

## 7. Constraints
- Strict preservation of design system visual tokens, component shapes, and 190+ SVG icon glyphs.
- Zero code generation during planning phase.
- Immutable data retention: financial records must not be deleted.
- Out of scope boundaries: direct core banking API settlement integration and automated card tap attendance ingest are handled upstream.

## 8. Risks
- Risk 01: Complex multi-period calculations across large student cohorts could cause UI lag; mitigated by optimized client-side calculation caching.
- Risk 02: Accidental rate changes altering past reports; mitigated by immutable snapshotting (ADR-M6-001).

## 9. Traceability
- Traced to Master Index `docs_legacy/00-master-index.md`
- Traced to SM1 Spec `docs_legacy/m6-sm1-cau-hinh-doi-soat.md`
- Traced to SM2 Spec `docs_legacy/m6-sm2-phien-doi-soat.md`
- Traced to Design System `Design System/readme.md`
- Traced to Visual Ground Truth in 17 captured screenshots

## 10. Review Loop
- `R-001`: Product Review Round completed by sophia-product-manager, aligning stories and functional requirements with legacy documentation.
- `R-002`: Architecture Review Round completed by david-systems-architect, validating snapshot immutability, data schemas, and lifecycle state machines.
- `R-003`: Quality Review Round completed by ada-qa-agent, establishing testable acceptance criteria and evidence ledgers.
