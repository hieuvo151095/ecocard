# Product Requirements Document (PRD): ECO Card Portal — Module M6 (Đối soát)

## 1. Product Goal & Vision
The **ECO Card Portal** serves as the centralized operating and billing governance platform for Finviet. The primary goal of **Module M6: Đối soát (Reconciliation & Settlement)** is to automate, standardize, and audit periodic fee calculation and billing reconciliations between Finviet and client educational institutions (School Groups and School Branches).

The module eliminates manual calculation errors, provides financial transparency, enforces immutable historical audit trails through configuration snapshots, and streamlines settlement lifecycle management from draft generation to final payment and retroactive arrears settlement (*truy thu*).

## 2. Target Users & Personas
- **Operations Administrator (Ops Admin)**: Responsible for onboarding educational legal entities (School Groups), configuring school branches, setting up billing periods, assigning applicable services, and defining tariff schedules in Sub-Module 1 (Cấu hình đối soát).
- **Billing Specialist / Finance Officer (Finance)**: Responsible for initiating periodic reconciliation runs, verifying live student scan calculations, submitting sessions for approval, generating formal statement documents, tracking payment completion, and launching retroactive settlement sessions in Sub-Module 2 (Phiên đối soát).
- **Executive Approver (Finance Lead / Director)**: Responsible for reviewing reconciliation draft sessions, inspecting itemized fee breakdowns and locked pricing snapshots, and formally approving or rejecting sessions.
- **School Administration / Accounting (External Partner)**: Recipient of the finalized reconciliation statement (*Biên bản đối soát*) delivered via configured email contacts.

## 3. Problem Statement & Business Opportunity
Prior to this module, billing calculation for multi-campus school groups required fragmented spreadsheets and manual cross-referencing between student enrollment rosters, service activation logs, and variable tariff contracts. This led to operational bottlenecks:
1. **Rate Mutation Risk**: Contract renegotiations or mid-year tariff adjustments could accidentally overwrite past accounting records.
2. **Double-Billing Risk**: Lack of centralized period locking allowed overlapping billing cycles for the same school branch.
3. **Arrears Friction**: Calculating retroactive charges for students registered late was labor-intensive and error-prone.
Module M6 resolves these challenges through automated student activity scanning, immutable configuration snapshotting, multi-step wizard safeguards, and integrated arrears management.

## 4. User Stories

### Sub-Module 1: Cấu hình đối soát (SM1)
- **US-01 (Group Search & Filtering)**: As an Ops Admin, I want to search and filter school groups by group name, code, tax code, contract number, branch code, or operational status so that I can quickly retrieve relevant accounts.
- **US-02 (Branch Hierarchy Inspection)**: As an Ops Admin, I want to expand any school group row to view its assigned school branches, active service dates, configured services, and per-branch status without navigating away from the list.
- **US-03 (School Group Onboarding)**: As an Ops Admin, I want to create a new school group by defining its legal entity details, selecting its settlement scope (*Theo nhóm trường* vs *Theo từng trường*), generating its multi-period schedule, and setting active month thresholds.
- **US-04 (Group Configuration Maintenance)**: As an Ops Admin, I want to edit an existing school group's contract notes, representative, billing emails, schedule periods, and rounding rules while keeping its unique code locked.
- **US-05 (Branch Assignment & Tariff Setup)**: As an Ops Admin, I want to assign a school branch to a group, specify its enrolled student count, select applicable services (*Phần mềm quản lý nhà trường*, *Camera AI*, *Thẻ học sinh*, *Căn tin học đường*), and configure unit prices per period.
- **US-06 (Branch Tariff Modification)**: As an Ops Admin, I want to adjust a branch's service tariffs across active periods so that upcoming reconciliation sessions apply updated contract pricing without impacting past sessions.
- **US-07 (Operational Status Management)**: As an Ops Admin, I want to toggle active/inactive status at both the group level and the branch level to prevent unapproved session generation.

### Sub-Module 2: Phiên đối soát (SM2)
- **US-08 (Session Search & KPI Monitoring)**: As a Finance Officer, I want to filter reconciliation sessions by session code, group, school, lifecycle status, arrears status, cut-off date, and creation date, while observing aggregated summary counters across all states.
- **US-09 (Session Creation Wizard)**: As a Finance Officer, I want to generate a new reconciliation session using a guided 3-step wizard that selects the group, specifies the period and cut-off date, and previews calculated student fees.
- **US-10 (Zero-Fee Prevention Guard)**: As a Finance Officer, I want the system to block session creation and display an explicit warning if any selected branch has a total calculated fee of 0 VND, preventing blank invoices.
- **US-11 (Immutable Configuration Snapshot)**: As an Auditor, I want each created session to permanently lock a snapshot of the active service tariffs and thresholds so that future configuration changes never alter past settlement figures.
- **US-12 (Session Lifecycle Execution)**: As a Finance Officer, I want to recalculate draft sessions, submit drafts for managerial approval, download statements, transmit statements to school contacts, and record final settlement.
- **US-13 (Managerial Approval Workflow)**: As a Finance Lead, I want to review sessions awaiting approval, examine service breakdown lines, and either approve the session for transmission or reject it back to draft.
- **US-14 (Retroactive Arrears Settlement / Truy thu)**: As a Finance Officer, I want to create a child retroactive settlement session directly from a paid parent session to collect outstanding fees for newly enrolled students.

## 5. Functional Requirements

### 5.1 Reconciliation Configuration (SM1)
- **FR-SM1-01 (Unique Group Identifier)**: The system shall enforce a globally unique alphanumeric group code (`group_code`) upon creation and make it permanently immutable during updates (BR01).
- **FR-SM1-02 (Settlement Scope Designation)**: The system shall support two mutually exclusive settlement modes (BR02):
  - `GROUP`: Consolidates all branches into a single reconciliation statement for the legal entity.
  - `BRANCH`: Creates independent reconciliation sessions and statements for each individual branch.
- **FR-SM1-03 (Recipient Email Validation)**: The system shall validate recipient emails (up to 3 addresses separated by commas or semicolons) at both group and branch levels (BR03).
- **FR-SM1-04 (Period Schedule Engine)**: The system shall support automatic generation of billing periods (`Sinh lịch kỳ`) based on service year date range and period count, as well as manual period addition and fee-collection toggling per period (BR04, BR05).
- **FR-SM1-05 (Threshold & Day Rounding Rules)**: The system shall compute student active thresholds using configured minimum active months (`Ngưỡng thu (tháng)`) and convert surplus active days exceeding the threshold (`Ngày dư làm tròn lên 1 tháng`) into a full billing month (BR06, BR07).
- **FR-SM1-06 (Multi-Service Tariff Matrix)**: The system shall allow each branch to select from 4 supported services (*Phần mềm quản lý nhà trường*, *Camera AI*, *Thẻ học sinh*, *Căn tin học đường*) and assign independent unit prices (VND/student/month) across each billing period (BR08, BR09).
- **FR-SM1-07 (Hierarchical Status Control)**: The system shall maintain independent active switches for school groups and individual branches (BR10).

### 5.2 Reconciliation Sessions (SM2)
- **FR-SM2-01 (Single Active Session Per Period)**: The system shall allow only one active reconciliation session per period for any given group or branch, flagging periods that already possess an active session with `Đã có phiên` (BR01).
- **FR-SM2-02 (Automated Student Scan & Preview)**: Prior to session generation, the system shall scan active student records up to the cut-off date and compute student counts, current period fees, retroactive arrears, and total payable amounts (BR03).
- **FR-SM2-03 (Zero-Fee Blocker Guard)**: The system shall strictly block session creation if any branch in the batch has a total payable amount of 0 VND, presenting error message MSG-01 and disabling the submission action (BR03, MSG-01).
- **FR-SM2-04 (Snapshot Immutability Engine)**: Upon session creation, the system shall copy the complete active tariff matrix, period boundaries, and calculation thresholds into an immutable JSON snapshot embedded in the session entity (BR04).
- **FR-SM2-05 (Multiple Service Multiplier)**: The system shall compute fees per service per student, allowing students utilizing multiple services to generate distinct itemized fee lines (BR05).
- **FR-SM2-06 (Strict Lifecycle State Machine)**: The system shall enforce the operational state transitions:
  - `DRAFT (Nháp)` -> `CHO_DUYET (Chờ duyệt)` via `Gửi duyệt`
  - `DRAFT (Nháp)` -> `CANCELLED (Đã hủy)` via `Hủy phiên`
  - `CHO_DUYET (Chờ duyệt)` -> `APPROVED (Đã duyệt)` via `Duyệt phiên`
  - `CHO_DUYET (Chờ duyệt)` -> `REJECTED (Đã từ chối)` via `Từ chối`
  - `APPROVED (Đã duyệt)` -> `SENT_TO_SCHOOL (Đã gửi trường)` via `Gửi biên bản`
  - `SENT_TO_SCHOOL (Đã gửi trường)` -> `PAID (Đã thanh toán)` via `Xác nhận thanh toán`
- **FR-SM2-07 (Nested Arrears Sessions)**: The system shall allow generation of child retroactive settlement sessions (`PHIÊN TRUY THU`) exclusively from sessions in `PAID (Đã thanh toán)` status, linking the child session hierarchically to the parent (BR07).
- **FR-SM2-08 (Statement Transmission & Export)**: The system shall support downloading formal reconciliation statements and exporting detailed data spreadsheets across approved sessions.

## 6. Non-Functional Requirements
- **NFR-01 (UI Language & Localization)**: The entire user interface shall be rendered in Vietnamese, matching banking and accounting terminology standards in Vietnam.
- **NFR-02 (Currency & Date Standards)**: All financial amounts shall display in Vietnamese Dong (VNĐ) formatted with dot thousand separators (e.g. `1.008.000đ`). All dates shall strictly format as `DD/MM/YYYY`.
- **NFR-03 (Design System Compliance)**: All visual surfaces shall consume official CSS design tokens from ECO Design System 1.0 (Primary Blue `#0070CE`, Brand Yellow `#FEC020`, Green `#00AB56`, Red `#FF424E`).
- **NFR-04 (Performance & Response Time)**: The student roster scan and fee simulation during Step 3 of session creation shall complete within 1.5 seconds for cohorts up to 10,000 students, displaying a clean loading indicator (`Đang quét học sinh và tính phí...`).
- **NFR-05 (Auditability & Data Integrity)**: Financial records must never be deleted; cancellation transitions must record actor identity and timestamp while releasing student active holds.

## 7. Acceptance Criteria (Summary Matrix)
| ID | Requirement | Success Criteria |
|---|---|---|
| AC-01 | Group Creation | Submitting valid legal data creates group, establishes periods, and appears in list. |
| AC-02 | Branch Assignment | Branch assigned to group appears in expanded row with correct service rates. |
| AC-03 | 0 VND Guard | If any branch has total fee = 0 VND, modal displays warning MSG-01 and disables create button. |
| AC-04 | Snapshot Lock | Modifying SM1 tariffs after creating an SM2 session leaves session fees unchanged. |
| AC-05 | State Flow | Draft session can be recalculated, submitted, approved, sent, and marked paid. |
| AC-06 | Truy thu Generation | Paid session displays `Tạo phiên truy thu`, creating a nested child session. |

## 8. Out of Scope
- Direct integration with school core banking APIs or automated payment gateways (handled via manual confirmation or webhook in future phase).
- Student attendance tracking and card tap hardware ingestion (handled by upstream student management modules).
- Hard deletion of financial records (strictly prohibited by financial audit policy).
