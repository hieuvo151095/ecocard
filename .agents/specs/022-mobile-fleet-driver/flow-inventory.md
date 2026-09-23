# Flow Inventory — 022-mobile-fleet-driver

## Flow Map: `FLOW-001` (Mobile Delivery & Proof-of-Delivery Loop)

```
[MOB-001 Route Dashboard]
         │
         ▼ (Tap "Scan Package")
[MOB-002 Camera QR Scanner]
         │
         ▼ (QR Code Verified)
[MOB-003 PoD Signature Drawer]
         │
         ▼ (Submit Signature & Photo)
[Route Completed Toast & Next Stop]
```

### Steps Breakdown
1. **Step 1 (View Active Drop-off)**: Driver checks `MOB-001` for next delivery address and SLA countdown.
2. **Step 2 (Scan Package Barcode)**: Driver opens camera scanner on `MOB-002` to confirm package matches Manifest SKU.
3. **Step 3 (Capture Signature & Photo)**: Customer signs on touch pad `MOB-003` and driver takes drop-off location photo.
4. **Step 4 (Complete & Sync)**: Batch sync payload sent to backend; UI updates route progress indicator.
