# Technical Knowledge & Architecture Baseline: Module M6 (Đối soát)

This document records the architectural standards, technical guidelines, domain rules, and strict operational constraints governing the implementation of Module M6 in the ECO Card Portal.

---

## 1. Technical Stack Assumptions
- **Frontend Architecture**: Modern single-page application built on React 18, utilizing declarative components, functional hooks, and context-based state management.
- **Styling Architecture**: Strict CSS design token binding consuming tokens declared in `Design System/tokens/` (`colors.css`, `typography.css`, `spacing.css`, `shape.css`, `fonts.css`). Utility classes align directly with token custom properties.
- **Iconography**: Materialized inline SVG vectors utilizing the 190+ glyph definitions in `Design System/assets/icons/icon-data.js`. No generic icon fonts or mismatched third-party icon packs.
- **Persistence & Mock Layer**: Fast, deterministic in-memory store backed by browser `localStorage`, seeded with authentic legacy test fixtures matching the screenshots (`HIEUTEST`, `TESTUAT`, `THUANTEST`).

---

## 2. Architectural Rules & Invariants
1. **Decoupled Snapshot Immutability (BR04)**: When a reconciliation session is created in SM2, the system must take a complete, deep JSON snapshot of the school group's billing configuration, active periods, branch assignments, and service tariffs. This snapshot is locked into the session record. Future modifications to SM1 configurations must NEVER retroactively alter figures in existing sessions.
2. **Deterministic Fee Calculation (BR06, BR07)**:
   - For any student record, active duration within the billing period is converted to months based on active days.
   - Surplus days exceeding the configured threshold (`Ngày dư làm tròn lên 1 tháng`) round up to a full active month.
   - Total service fee is calculated as:
     $$\text{ServiceFee} = \sum_{\text{active students}} (\text{ActiveMonths} \times \text{TariffRate})$$
   - Total branch fee sums all active services.
3. **Zero-VND Prevention Guard (BR03, MSG-01)**: The session creation process must evaluate calculated fees across all branches selected in the batch. If any branch yields a total fee of 0 VND, session creation must be blocked with an amber error notification, preventing empty invoices from reaching financial review.
4. **Strict Lifecycle State Machine (BR06)**: Operations must follow the forward state flow: `DRAFT -> CHO_DUYET -> APPROVED -> SENT_TO_SCHOOL -> PAID`. Transitions back to draft are permitted only through formal rejection by an approver. Cancellation is permitted only from the `DRAFT` state.

---

## 3. Naming & Code Standards
- **Identifiers**:
  - School Group identifiers must follow uppercase alphanumeric snake-free strings (e.g. `HIEUTEST`, `TESTUAT`).
  - Reconciliation Session identifiers must strictly follow the prefix pattern `REC-` followed by an uppercase 10-character hexadecimal token (e.g. `REC-B7A17279166`, `REC-518BB66CE4`).
- **Formatting Conventions**:
  - Currency: Vietnamese Dong formatted with dot thousand separators and trailing lower-case `đ` (e.g. `1.008.000đ`, `750.000đ`, `0đ`).
  - Dates: Vietnamese standard `DD/MM/YYYY` (e.g. `07/09/2026`).
  - Numbers: Standard Vietnamese decimal notation.
- **Component File Structure**:
  - Components named in PascalCase (e.g. `GroupDrawer.jsx`, `CreateSessionModal.jsx`).
  - Service functions named in camelCase (e.g. `calculateBranchFees`, `transitionSessionStatus`).

---

## 4. Security & Compliance Constraints
- **Role Separation**: Although legacy development environments operated with unified administrative accounts, the system architecture must model distinct permission boundaries:
  - *Ops Admin*: Can create/edit configurations in SM1 and draft sessions in SM2. Cannot formally approve sessions.
  - *Finance Lead*: Can review sessions submitted for review, approve/reject, transmit statements, and record payments.
- **Input Sanitization**: Email addresses must be validated against RFC 5322 regex standards and capped at a maximum of 3 recipient addresses per group or branch (BR03).
- **Data Protection**: Financial statement records and snapshot audit trails must be protected against destructive deletion.

---

## 5. "Never Do" List (Anti-Patterns)
- **NEVER** perform hard deletions of reconciliation sessions or school groups. Use soft-delete / status toggles (`Bật/Tắt` switches and `Đã hủy` states) to preserve audit trails.
- **NEVER** re-calculate session fees for past periods using current SM1 tariffs. Always read from the locked `snapshot_config` embedded within the session.
- **NEVER** permit creation of a reconciliation session if any selected branch has a total fee of 0 VND.
- **NEVER** allow multiple active non-cancelled sessions for the exact same school branch and period schedule.
- **NEVER** use generic unapproved font families; stick to the Helvetica Neue / Inter stack specified in `Design System/tokens/fonts.css`.
- **NEVER** hand-code arbitrary colors outside the official design system tokens in `Design System/tokens/colors.css`.
