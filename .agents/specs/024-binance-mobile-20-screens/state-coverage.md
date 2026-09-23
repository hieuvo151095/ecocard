# State Coverage Matrix — 024-binance-mobile-20-screens

## Mandatory 8-State Machine Matrix across 20 Mobile Screens

| State Name | `MOB-001` - `MOB-005` | `MOB-006` - `MOB-010` | `MOB-011` - `MOB-015` | `MOB-016` - `MOB-020` |
| :--- | :--- | :--- | :--- | :--- |
| `initial` | Login form initialized | Camera scanner ready | Wallet zero balance | Deposit QR code generated |
| `loading` | Verifying 2FA SMS code | Connecting websocket chart | Executing leverage trade | Loading trade logs spinner |
| `empty` | Zero login history | Search zero results | No open futures positions | No trade history logs |
| `populated` | User authenticated state | Live BTC candlestick loaded | Wallet balance $12,500 | Wallet QR & P2P active |
| `validation-error` | Invalid OTP code alert | Out of range price alert | Margin ratio alert | Invalid withdrawal address |
| `system-error` | SMS gateway timeout | Chart engine timeout | Liquidation warning banner | Node sync failed alert |
| `success` | Login success green toast | Order filled green toast | Staking deposit complete | Address saved green toast |
| `permission-denied` | 2FA locked state | KYC Level 2 required lock | Futures restricted zone | API key write restricted |
