# State Coverage Matrix — 022-mobile-fleet-driver

## Mandatory 8-State Machine Matrix

| State Name | `MOB-001` (Dashboard) | `MOB-002` (Scanner) | `MOB-003` (PoD Drawer) |
| :--- | :--- | :--- | :--- |
| `initial` | Delivery list initialized | Camera permission prompt | Clean signature pad |
| `loading` | Skeleton delivery route cards | Camera starting indicator | Syncing payload spinner |
| `empty` | All deliveries completed state | Manual search zero results | No photo attached alert |
| `populated` | Active route stops loaded | QR code detected frame | Signed pad with recipient name |
| `validation-error` | Missing GPS permission banner | Invalid SKU QR scanned alert | Signature required warning |
| `system-error` | Offline network queue alert | Camera API hardware error | Sync payload failed alert |
| `success` | Route completion celebratory | Package match green badge | PoD submitted green toast |
| `permission-denied` | Driver access locked screen | Camera permission denied card | Driver sign-off locked |
