# Design System Binding Context (`design-context.md`)

<!--
active_design_system: erp-enterprise
version: 1.0.0
-->

> **Active Design System**: erp-enterprise  
> **System Version**: 1.0.0  
> **Inheritance Tier**: Extension of `@company/design-system`  

---

## 1. Bound System Configuration
* **active_design_system**: erp-enterprise
* **Design System Path**: `.agents/design-systems/erp-enterprise/DESIGN.md`
* **Tokens JSON Path**: `.agents/design-systems/company/tokens.json`
* **Allowed Tokens Scope**: Full semantic color tokens (`bg`, `text`, `interactive`, `status`), typography scale (base $14\text{px}$, compact table $13\text{px}$), 4px grid spatial tokens.
* **Allowed Component Families**: `DataTable`, `Button`, `Badge`, `Alert`, `TextInput`, `Select`, `Card`, `Tabs`.
* **Allowed Layout Patterns**: `pattern-table-grid`, `pattern-form-detail`.

---

## 2. Governance Constraints
* **Forbidden Moves**: Hardcoded color hex codes outside semantic tokens; emojis as bullet icons; unapproved custom fonts; low contrast text ($<4.5:1$).
* **Exception Status**: None (100% compliant).
* **Design System Review Owner**: Design System Governor Lead.
