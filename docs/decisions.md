# Architecture Decision Records (ADR): Module M6 (Đối soát)

This document formalizes critical architectural and design decisions established during the genesis planning for Module M6.

---

### ADR-M6-001: Immutable Configuration Snapshotting at Session Creation

- **Context**:
  In educational financial reconciliation, school tariffs and billing schedules are renegotiated periodically. If past reconciliation sessions dynamically referenced live configuration tables, retroactive tariff updates in SM1 would alter historical settlement figures, corrupting accounting reports and violating financial audit standards.
- **Decision**:
  Upon the creation of any reconciliation session in SM2, the calculation engine copies a complete JSON snapshot of the effective tariff schedule, active branch parameters, and threshold rules directly into the session entity under `snapshot_config`. The session detail screen renders this immutable record in the "Cấu hình đã khóa" tab.
- **Alternatives Rejected**:
  1. *Dynamic Foreign Key Joins with Effective Date Range Tables*: Rejected due to high query complexity, vulnerability to historical data corruption during retro-dated edits, and difficulty verifying audit trails.
  2. *Static PDF Archival Only*: Rejected because the system must support dynamic recalculations during the `Nháp` phase and structured data export (*Xuất dữ liệu*) without parsing static documents.
- **Evidence / Sources**:
  Supported by Evidence `E003` and `E004` (derived from Sources `S001` and `S003`).
- **Consequences**:
  - Positive: Guarantees complete auditability and mathematical immutability for finalized statements.
  - Positive: Eliminates regression risk when Ops administrators update contracts in SM1.
  - Trade-off: Slightly higher storage footprint per session record (mitigated by compact JSON representation).
- **Rollback Trigger**:
  If business requirements mandate global retrospective tariff adjustments across historical sessions (deemed extremely improbable under Vietnamese financial compliance laws).

---

### ADR-M6-002: Batch-Level Zero-Fee Hard Blocking Guard

- **Context**:
  During reconciliation session creation, an operator may select a cohort of school branches where one or more branches generated 0 active billable student months (e.g. newly onboarded schools with zero attendance, or periods where service start dates post-date the period). Generating zero-fee sessions creates clutter in accounting ledgers and generates zero-value debt notices.
- **Decision**:
  Enforce a batch-level blocking guard in Step 3 of the session creation wizard. If any branch in the selected batch calculates to 0 VND total fee, the system displays an amber warning alert citing the specific branch name and hard-disables the `Tạo phiên` button (MSG-01) until the operator deselects the unbillable branch or corrects cut-off parameters.
- **Alternatives Rejected**:
  1. *Silent Exclusion of 0 VND Branches*: Rejected because operators must explicitly decide whether to adjust cut-off dates or remove the branch, preventing accidental omissions.
  2. *Warning with Allowable Override*: Rejected because allowing zero-fee sessions violates accounting invariant BR03.
- **Evidence / Sources**:
  Supported by Evidence `E005` and `E006` (derived from Sources `S003` and `S006`).
- **Consequences**:
  - Positive: Prevents generation of empty financial statements.
  - Positive: Explicitly communicates missing student activity to the operator.
  - Trade-off: Requires operators to uncheck 0 VND branches when creating bulk sessions.
- **Rollback Trigger**:
  If contractual terms require zero-value confirmation statements for audit purposes.

---

### ADR-M6-003: Hierarchical Modeling of Retroactive Arrears Sessions (Truy thu)

- **Context**:
  After a reconciliation session has been marked as `Đã thanh toán`, late student registrations or retroactive enrollment adjustments often require collecting additional fees for that past period.
- **Decision**:
  Implement child retroactive settlement sessions (`PHIÊN TRUY THU`) linked to the parent session via `parent_session_id`. Child sessions inherit the parent's locked configuration snapshot, possess their own distinct session code, proceed through independent lifecycle states, and render nested directly under the parent session in the master table.
- **Alternatives Rejected**:
  1. *Re-opening Paid Parent Sessions*: Rejected because modifying a finalized and paid financial record breaks accounting immutability.
  2. *Unconnected Standalone Sessions*: Rejected because operators need immediate visual traceability linking retroactive collections to their original billing session.
- **Evidence / Sources**:
  Supported by Evidence `E008` (derived from Sources `S003` and `S005`).
- **Consequences**:
  - Positive: Preserves financial accounting integrity while accommodating late enrollment billing.
  - Positive: Clean visual hierarchy in the session table via expandable sub-rows.
  - Trade-off: State machine must maintain parent-child relationship validations.
- **Rollback Trigger**:
  If billing policies require aggregating all retroactive fees into the subsequent regular period instead of creating dedicated arrears sessions.
