# Screen Catalog — 022-mobile-fleet-driver

## Screen Inventory

### 1. `MOB-001` — Active Delivery Route Dashboard
* **Purpose**: Primary driver landing screen showing active delivery queue, route map link, and SLA status.
* **Layout**: Mobile Header + Active Delivery Card + Quick Actions Bar + Bottom Navigation.
* **Key Actions**: `Tap Navigate (Maps)`, `Tap Scan Package QR`, `View Order SKUs`.

### 2. `MOB-002` — Camera Package QR Scanner
* **Purpose**: Live camera viewfinder overlay to scan and match physical package QR codes against delivery manifest.
* **Layout**: Fullscreen Viewfinder + Scan Target Bounding Box + Flashlight Toggle + Manual Input Fallback.
* **Key Actions**: `Scan Barcode`, `Toggle Torch`, `Manual Code Entry`.

### 3. `MOB-003` — Proof-of-Delivery (PoD) Signature Drawer
* **Purpose**: Capture customer electronic signature and delivery photo for instant sign-off.
* **Layout**: Touch Signature Canvas + Photo Preview Attachment + Recipient Name Input + Confirm Drop-off Button.
* **Key Actions**: `Clear Signature`, `Take Photo`, `Submit Proof of Delivery`.
