# Enterprise ERP Design System Extension (`DESIGN.md`)

> **Extends**: `company/DESIGN.md`  
> **Target Domain**: Complex business forms, multi-step approval workflows, dense transaction grids, ERP back-office tools.

## 1. Domain Principles
* **Maximum Data Efficiency**: Compact row heights (`28px`-`32px`), high information density, zero whitespace waste.
* **Audit Trail Visibility**: Action logs, timestamp tracking, and user attribution built into every form and detail panel.
* **Multi-Role Scoping**: Layouts adapt dynamically to user permissions (Read-only vs Approver vs Data Entry).

## 2. Density & Component Overrides
* Default table density: `compact` (`font-size: 13px`, `padding: 6px 12px`).
* Form grid layout: 3-column or 4-column compact form layouts.
* Status workflow badges: Clear approval status progression (Draft → Pending Approval → Approved → Rejected).
