# System Memory & Operational Context: Module M6 (Đối soát)

This document records the operational context, accepted assumptions, resolved contradictions, and historical memory for the rebuild of Module M6 in the ECO Card Portal.

---

## 1. Operational Memory & Project Heritage
- **Project Identity**: ECO Card Portal is Finviet's school operations management portal. The legacy application on `eco-card-portal-dev.finviet.com.vn` provided the functional baseline captured in `docs_legacy/` and 17 high-resolution screenshots.
- **Design System Heritage**: The visual language is anchored to **ECO Design System 1.0 (Consumer)**, transcribed from Figma into tokens and React component primitives located under `Design System/`.
- **Constitutional Alignment**: Development strictly obeys the Marcus Fleet Constitution (V1.0.0), enforcing specification as the source of truth, test-first verification, zero unverified claims, and separation of planning from execution.

---

## 2. Accepted Assumptions & Clarification Resolutions
1. **User Role Access Model (K001)**: While the legacy test account had access to all functionality without visible UI gates, the production architecture assumes three logical personas: Portal Administrator, Operations Administrator (creates and edits configurations and drafts sessions), and Finance Officer / Approver (reviews, approves, transmits, and marks paid). The UI will support switching between these simulated roles to facilitate comprehensive verification.
2. **Duplicate Period Prevention (K002)**: Periods marked with `Đã có phiên` in the creation modal are treated as strictly protected against duplicate active sessions. An active period cannot spawn a new session unless the existing session has reached `Đã hủy`.
3. **Payment Confirmation Flow (K003)**: The transition from `Đã gửi trường` to `Đã thanh toán` is implemented as an explicit action button for the Finance role, ensuring complete workflow testability without requiring external bank integration.
4. **Student Hold Release on Cancellation (K004)**: The secondary label `Đã nhả kết quả` observed in legacy screenshots represents the system state where student activity records previously claimed by a draft session are released back to the unbilled pool upon session cancellation.

---

## 3. Residual Risks & Future Observability
- **Volume Scaling**: Simulating large cohorts (10,000+ students) requires efficient calculation algorithms to maintain the 1.5-second scan response target.
- **Email Delivery Integration**: In the planned mock environment, email transmission (`Gửi biên bản`) will trigger an in-app visual notification toast and update the session state to `Đã gửi trường`. Integration with live SMTP/SES delivery services remains a post-MVP operational task.

---

## 4. TrustGraph & Agent Routing Notes
- Context retrieval and knowledge ingestion were bootstrapped from `agents.md` and feature spec `032-project-planning-eco-card-portal-module-m6-reconciliation`.
- Post-planning verification gates will validate research ledgers, claims, and legacy documentation completeness before implementation permission is requested.
