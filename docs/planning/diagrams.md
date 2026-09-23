# System Architecture Diagrams: Module M6 (Đối soát)

This document contains architectural diagrams documenting system context, container topology, relational data schemas, execution sequences, lifecycle state transitions, and observability boundaries.

---

## 1. C4 System Context Diagram

```mermaid
flowchart TD
    UserOps[Operations Administrator] -->|Configures Groups, Branches, Tariffs| Portal[ECO Card Portal Web App]
    UserFinance[Finance Officer / Approver] -->|Creates Sessions, Submits, Approves| Portal
    Portal -->|BFF API Calls / REST| Backend[ECO Card Portal Backend Services]
    Backend -->|Queries Enrollment & Attendance| CoreEdu[Education Core System]
    Backend -->|Persists Configs, Sessions, Snapshots| DB[(Reconciliation Relational Database)]
    Backend -->|Transmits Statements| Mailer[Notification & Email Service]
    Mailer -->|Sends Biên bản đối soát| School[School Accounting / Representative]
```

The system context diagram illustrates the boundary between the internal portal users, the core portal frontend, the backend reconciliation services, the school educational database, and the outbound statement delivery services.

---

## 2. C4 Container & Component Architecture Diagram

```mermaid
flowchart LR
    subgraph BrowserClient [Browser Client: React SPA]
        HeaderComp[Global Header & Nav]
        SM1Pages[SM1 Config: List, Drawer, Period Engine]
        SM2Pages[SM2 Sessions: List, Wizard, Detail Tabs]
        StateStore[Portal Context & In-Memory Store]
        HeaderComp --> StateStore
        SM1Pages --> StateStore
        SM2Pages --> StateStore
    end

    subgraph ServiceLayer [Application Services Layer]
        CalcEngine[Reconciliation Calculator]
        SnapshotMgr[Snapshot Immutability Manager]
        StateMachine[Session State Machine]
        StateStore --> CalcEngine
        StateStore --> SnapshotMgr
        StateStore --> StateMachine
    end

    subgraph PersistenceLayer [Persistence & External Interfaces]
        LocalStorage[Browser Storage / Local Cache]
        APIGateway[Finviet API Gateway]
        CalcEngine --> LocalStorage
        SnapshotMgr --> LocalStorage
        StateMachine --> LocalStorage
        StateStore -.-> APIGateway
    end
```

The component diagram demonstrates the modular structure within the web client: presentation pages interact with the centralized state store, which coordinates with the calculation engine, snapshot manager, and state machine before syncing with persistence layers.

---

## 3. Entity-Relationship Data Model Diagram

```mermaid
erDiagram
    SCHOOL_GROUP ||--o{ SCHOOL_BRANCH : contains
    SCHOOL_GROUP ||--o{ PERIOD_SCHEDULE : defines
    SCHOOL_BRANCH ||--o{ BRANCH_SERVICE_TARIFF : applies
    PERIOD_SCHEDULE ||--o{ BRANCH_SERVICE_TARIFF : rates_for
    SCHOOL_GROUP ||--o{ RECONCILIATION_SESSION : generates
    RECONCILIATION_SESSION ||--o{ SESSION_BRANCH_DETAIL : items
    SESSION_BRANCH_DETAIL ||--o{ SESSION_SERVICE_LINE : breakdowns
    RECONCILIATION_SESSION ||--o{ RECONCILIATION_SESSION : child_truy_thu

    SCHOOL_GROUP {
        string group_code PK "Unique immutable code"
        string group_name "Legal name"
        string tax_code "Mã số thuế"
        string contract_number "Số hợp đồng"
        string settlement_unit "GROUP or BRANCH"
        string recipient_emails "Max 3 emails"
        int threshold_months "Min active months"
        int round_days_threshold "Surplus days rounding"
        boolean is_active "Status toggle"
    }

    SCHOOL_BRANCH {
        string branch_code PK "Unique school identifier"
        string group_code FK "Parent school group"
        string branch_name "School display name"
        date start_date "Service start date"
        date contract_date "Date contract signed"
        int registered_students "Enrolled student count"
        string recipient_emails "Branch recipient emails"
        boolean is_active "Status toggle"
    }

    PERIOD_SCHEDULE {
        string period_id PK "Unique period identifier"
        string group_code FK "Parent group"
        string period_name "Kỳ 1, Kỳ 2, etc."
        date start_date "Period start"
        date end_date "Period end"
        boolean is_fee_collected "Thu phí flag"
    }

    BRANCH_SERVICE_TARIFF {
        string tariff_id PK
        string branch_code FK
        string period_id FK
        string service_code "MANAGEMENT, CAMERA, CARD, CANTEEN"
        decimal unit_price "VND per student per month"
    }

    RECONCILIATION_SESSION {
        string session_code PK "REC-XXXXXXXXXX"
        string parent_session_id FK "Optional parent for truy thu"
        string group_code FK
        string period_id FK
        string settlement_unit "GROUP or BRANCH"
        date cutoff_date "Mốc chốt số liệu"
        string status "NHAP, CHO_DUYET, DA_DUYET, DA_GUI, DA_THANH_TOAN, DA_HUY"
        int total_students "Total billable students"
        decimal period_fee "Phí kỳ này"
        decimal arrears_fee "Truy thu kỳ trước"
        decimal total_fee "Tổng phải thu"
        json snapshot_config "Frozen tariffs and thresholds"
    }
```

The relational schema links legal groups to branches, periods, and tariff matrices. Sessions freeze configurations into a JSON snapshot attribute and support self-referential parent-child relationships for retroactive settlement (*truy thu*).

---

## 4. Sequence Diagram: Session Creation & Zero-Fee Evaluation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Officer as Finance Officer
    participant UI as CreateSessionModal (SM2)
    participant Engine as ReconciliationCalculator
    participant Store as SessionStore

    Officer->>UI: Selects Group & Period Schedule
    Officer->>UI: Clicks "Xem số liệu"
    UI->>Engine: scanActiveStudents(groupId, periodId, cutoffDate)
    Engine->>Engine: Calculate active months & apply surplus day rounding
    Engine->>Engine: Multiply by tariffs for all active services
    Engine-->>UI: Return branch-level calculations

    alt Any selected branch has total fee = 0 VND
        UI->>UI: Render Alert: MSG-01 "Không thể tạo phiên có tổng phí 0đ"
        UI->>UI: Hard-disable "Tạo phiên" button
        Officer->>UI: Adjusts branch selection or cut-off date
    else All selected branches have total fee > 0 VND
        UI->>UI: Render Alert: MSG-02 "Đã quét N học sinh"
        UI->>UI: Display summary KPI preview cards
        UI->>UI: Enable "Tạo phiên" button
        Officer->>UI: Clicks "Tạo phiên"
        UI->>Store: createSessionWithSnapshot(draftData, snapshotConfig)
        Store-->>UI: Return new session entity (status: Nháp)
        UI-->>Officer: Navigate to session detail screen
    end
```

The sequence diagram captures the primary creation workflow and illustrates the conditional evaluation path enforcing the 0 VND validation guard (MSG-01).

---

## 5. Session Lifecycle State Machine Diagram

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Nhap : Created via Wizard
    Nhap --> Nhap : Tính lại các nhánh
    Nhap --> DaHuy : Hủy phiên (Releases holds)
    Nhap --> ChoDuyet : Gửi duyệt
    ChoDuyet --> DaTuChoi : Từ chối (Returns to draft)
    DaTuChoi --> Nhap : Adjust figures
    ChoDuyet --> DaDuyet : Duyệt phiên
    DaDuyet --> DaGuiTruong : Gửi biên bản
    DaGuiTruong --> DaThanhToan : Xác nhận thanh toán
    DaThanhToan --> PhienTruyThu : Tạo phiên truy thu
    PhienTruyThu --> [*]
    DaHuy --> [*]
```

This state chart outlines the strict linear and branched state flow of a reconciliation session, specifying which actions trigger lifecycle advancements.

---

## 6. Rollback & Change Advisory Board (CAB) Flow

```mermaid
flowchart TD
    Detect[Discrepancy Detected in Live Session] --> CheckState{Session State?}
    CheckState -- Nháp --> DirectCancel[Operator clicks Hủy phiên -> Student holds released]
    CheckState -- Chờ duyệt --> RejectFlow[Approver clicks Từ chối -> Reverts to Nháp]
    CheckState -- Đã duyệt / Đã gửi trường --> CABReview[Formal CAB & Finance Approval Required]
    CABReview --> AdminVoid[Admin voids session with audit note -> Re-generates new session]
    CheckState -- Đã thanh toán --> ArrearsCorrection[Launch Phiên truy thu for positive/negative adjustment]
```

The rollback flowchart governs error correction across each lifecycle stage, ensuring audit compliance and eliminating unauthorized data destruction.

---

## 7. Observability & Telemetry Signals Map

```mermaid
flowchart LR
    subgraph FrontendTelemetry [Client Metrics & Events]
        Event1[Search Query Latency]
        Event2[Wizard Completion Drop-off]
        Event3[Zero-Fee Block Trigger Rate]
        Event4[Drawer Save Error Rate]
    end

    subgraph ServiceMetrics [Business & System KPI Signals]
        Metric1[Total Reconciled Amount VNĐ]
        Metric2[Sessions By Status Gauge]
        Metric3[Student Active Scan Latency ms]
        Metric4[Retroactive Arrears Volume]
    end

    FrontendTelemetry --> Dashboard[Grafana & Portal Operations Dashboard]
    ServiceMetrics --> Dashboard
```

The telemetry diagram defines the operational logging signals captured at client and service boundaries to monitor settlement performance and operator activity.
