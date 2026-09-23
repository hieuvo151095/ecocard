# Screen Catalog: Enterprise Order Management & Bulk Fulfillment Dashboard

## Screen Inventory

### Screen 1: Order Fulfillment Main Grid (`SCR-001`)
* **Screen ID**: `SCR-001`
* **Linked Flows**: `FLOW-001`, `FLOW-001A`
* **Primary Job**: Display pending orders, facilitate SLA filtering, and execute batch allocation.
* **Critical Components**: `DataTable`, `FilterBar`, `BatchActionBar`, `StatusBadge`, `PaginationFooter`.
* **Entry Conditions**: User navigates to `/fulfillment/orders`.
* **Exit Conditions**: User executes batch fulfillment or opens single-order detail drawer (`SCR-002`).
* **Desktop Notes**: High-density compact grid ($32\text{px}$ row height); keyboard shortcuts (`Ctrl+A` select all, `Space` toggle row).
* **Mobile Notes**: Stacked card view layout with bottom fixed bulk action sheet.

### Screen 2: Batch Allocation Summary Modal (`SCR-002`)
* **Screen ID**: `SCR-002`
* **Linked Flows**: `FLOW-001`
* **Primary Job**: Review inventory allocation results before triggering label printing.
* **Critical Components**: `ModalContainer`, `SummaryStatGroup`, `ItemSplitTable`, `ButtonGroup`.
* **Entry Conditions**: User triggers `Run Bulk Inventory Allocation` from `SCR-001`.
* **Exit Conditions**: User confirms dispatch or cancels back to `SCR-001`.
* **Desktop Notes**: Centered modal ($720\text{px}$ width) with sticky footer action buttons.
* **Mobile Notes**: Full-screen slide-over sheet.
