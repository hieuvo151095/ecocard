# State Coverage Matrix — 023-crypto-binance-trading

## Mandatory 8-State Machine Matrix

| State Name | `CRYPTO-001` (Trading Floor) | `CRYPTO-002` (Order Modal) | `CRYPTO-003` (History & Wallet) |
| :--- | :--- | :--- | :--- |
| `initial` | Trading floor controls initialized | Market order form default | Empty trade logs |
| `loading` | Ticker websocket connecting | Executing market order spinner | Loading asset balances |
| `empty` | Zero open orders state | Zero balance alert | No filled trades history |
| `populated` | Live BTC/USDT candlestick loaded | Wallet balance 12.50 USDT | Filled orders list loaded |
| `validation-error` | Out of range price input alert | Insufficient funds warning | Invalid date range filter |
| `system-error` | Websocket disconnection banner | Matching engine timeout alert | DB connection error card |
| `success` | Order filled green toast | Order submitted alert | Asset balance updated |
| `permission-denied` | KYC level 2 required lock | Trading permissions disabled | Wallet view restricted |
