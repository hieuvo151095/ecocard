# State Coverage Matrix: Enterprise Order Management & Bulk Fulfillment Dashboard

## Screen State Matrix

### `SCR-001`: Order Fulfillment Main Grid
* **`initial`**: Table filter controls loaded; default view set to `Pending Fulfillment`.
* **`loading`**: Skeleton loader rows (10 animated grey bars) displayed while orders data is fetched.
* **`empty`**: Zero pending orders found. Displays "All orders fulfilled!" illustration card with "View Historical Logs" primary button.
* **`populated`**: High-density grid rendering 50 order rows with status badges, SLA timers, and bulk select checkboxes.
* **`validation-error`**: Inline red border and warning text when user attempts bulk action without selecting any order row.
* **`system-error`**: Red alert banner (`--color-status-error-bg`) displayed if inventory DB connection times out, with "Retry Connection" button.
* **`success`**: Green toast alert (`"25 Orders dispatched successfully. Printing labels..."`) shown after successful batch dispatch.
* **`permission-denied`**: Centered lock icon card displayed if user lacks `role:warehouse_admin` permissions, with "Request Access" CTA.
