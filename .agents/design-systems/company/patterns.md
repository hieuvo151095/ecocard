# Enterprise Layout Patterns

## 1. Dashboard Layout Pattern (`pattern-dashboard`)
* **Header**: Persistent app bar (`56px` height) with logo, active tenant indicator, search bar, notifications, and user avatar.
* **Sidebar**: Collapsible navigation drawer (`240px` expanded, `64px` collapsed) with section dividers and active state highlight.
* **Main Canvas**: Fluid width container (`padding: 24px`), CSS grid header KPIs, data tables, and activity feeds.

## 2. Form & Detail Layout Pattern (`pattern-form-detail`)
* **Page Header**: Breadcrumbs, H1 Title, status badge, and right-aligned primary action buttons.
* **2-Column Grid**: Left column ($70\%$ width) for primary field sections; Right column ($30\%$ width) for audit history, status timeline, and quick references.

## 3. Data-Dense Table Pattern (`pattern-table-grid`)
* **Filter Bar**: Search input, status dropdowns, date range picker, column customizer, export button.
* **Table Body**: Frozen header, checkable select-all rows, inline status badges, actions menu cell.
* **Footer Bar**: Total item count, page size selector, numeric pagination controls.
