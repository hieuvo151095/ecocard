# Flow Inventory — 023-crypto-binance-trading

## Flow Map: `FLOW-001` (Instant Spot Market Order Execution)

```
[CRYPTO-001 Trading Floor & Orderbook]
                  │
                  ▼ (Click "Buy BTC")
[CRYPTO-002 Spot Order Execution Modal]
                  │
                  ▼ (Confirm Market Order)
[CRYPTO-003 Trade History & Wallet Balances]
```

### Steps Breakdown
1. **Step 1 (Monitor Market Ticker)**: Trader views live BTC/USDT price ticker ($64,250.00 +3.45%) and orderbook bid/ask candles.
2. **Step 2 (Formulate Order)**: Trader clicks Binance Yellow CTA `Buy BTC` to open `CRYPTO-002` order form.
3. **Step 3 (Execute Order)**: Selects 75% wallet balance slider, verifies market price, and clicks `Buy BTC`.
4. **Step 4 (Order Filled)**: Green toast notification pops up; order history updates in `CRYPTO-003`.
