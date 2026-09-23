# Enterprise Product Design Screen Catalog — 024-binance-mobile-20-screens

> **Design System**: `binance/DESIGN.md`  
> **Platform**: Mobile Web / iOS Native ($390 \times 844\text{px}$)  
> **Quality Gate**: Enterprise Product Design Standard (Rich SVG Icons, 5-Tab Navigation, Real Market Depth Data)  

---

## Detailed 20-Screen Component & Layout Specifications

### 1. `MOB-001` — Splash & Brand Welcome
* **Layout Structure**: Fullscreen `section-dark` with Radial Gold Gradient backdrop (`radial-gradient(circle at 50% 45%, #f0b90b 0%, #fcd535 38%, #f8d12f 72%, rgba(248,209,47,0) 100%), #222126`).
* **Components**: SVG Binance Diamond Logo, Display Headline (BinancePlex 28px Bold), Subtitle (BinancePlex 14px Muted), Primary Pill CTA (`.btn-primary` with SVG Arrow Icon).
* **SVG Icons**: `logo-diamond.svg`, `arrow-right.svg`.

### 2. `MOB-002` — Onboarding 1 (Institutional Cold Storage)
* **Layout Structure**: Header Progress Indicator + Center Graphic Card + Action Group.
* **Components**: Circular Icon Container (`width: 72px`, `height: 72px`, `background: rgba(240,185,11,0.15)`), Shield SVG Icon, Feature Bullets (SAFU 1:1 Reserve Guarantee), Primary & Secondary Pill CTAs.
* **SVG Icons**: `shield-check.svg`, `lock-closed.svg`, `check-circle.svg`.

### 3. `MOB-003` — Onboarding 2 (Spot & Derivatives Trading Engine)
* **Layout Structure**: Header Progress Indicator + Live Ticker Mini Preview + Action Group.
* **Components**: Lightning Bolt SVG Icon, Mini Ticker Card (`BTC/USD $68,432.10 +2.41%`), Sub-millisecond Execution Badge, Primary Pill CTA.
* **SVG Icons**: `zap-lightning.svg`, `trending-up.svg`, `sliders.svg`.

### 4. `MOB-004` — Biometric Login & FaceID Auth
* **Layout Structure**: Form Container (`max-width: 350px`) + Input Fields + Biometric Trigger.
* **Components**: Email/Phone Field with User SVG Icon, Password Field with Eye/Lock SVG Icon, FaceID Sensor Graphic, `.btn-primary` Sign In CTA, Forgot Password Link.
* **SVG Icons**: `user.svg`, `lock.svg`, `face-id.svg`, `eye.svg`.

### 5. `MOB-005` — 2FA Security OTP Verification
* **Layout Structure**: Security Header + 6-Digit Pin Input Grid + Countdown Resend.
* **Components**: Keyhole SVG Shield, 6 Box Pin Inputs ($44 \times 52\text{px}$ each with Gold Focus Ring), Resend Timer (59s), `.btn-primary` Verify CTA.
* **SVG Icons**: `key.svg`, `shield-alert.svg`, `clock.svg`.

### 6. `MOB-006` — KYC Identity Photo Upload
* **Layout Structure**: Stepper Header (Step 2 of 3) + Camera Viewfinder Box + Guidelines Card.
* **Components**: Passport Viewfinder Target Box with Corner Crosshairs, Camera Capture Trigger SVG Button, Guidelines Checklist (No Glare, Full Frame), Submit CTA.
* **SVG Icons**: `camera.svg`, `file-text.svg`, `check.svg`, `alert-circle.svg`.

### 7. `MOB-007` — Home Market Dashboard
* **Layout Structure**: Top Bar (Avatar, Search, Notification Bell) + Hero Ticker Grid + Market Category Tabs + Hot Gainers List + 5-Tab Bottom Navigation Bar.
* **Components**: Search Bar with Search SVG, Ticker Grid (BTC, ETH, BNB, SOL), Market Category Pills (Hot, Gainers, Losers, 24h Vol), List Items with Sparkline Charts, 5-Tab Bottom Bar (Home 🏠, Markets 📊, Trade ⚡, Futures 📉, Wallet 👛).
* **SVG Icons**: `user-avatar.svg`, `search.svg`, `bell.svg`, `home.svg`, `bar-chart.svg`, `repeat.svg`, `line-chart.svg`, `wallet.svg`.

### 8. `MOB-008` — Search & Watchlist
* **Layout Structure**: Search Header with Back Arrow + Favorite Star List + Recent Searches Chips.
* **Components**: Real-time Filter Input, Star SVG Toggle, Price Ticker Item Cards (`BTC/USDT $68,432.10`, `ETH/USDT $3,584.20`).
* **SVG Icons**: `arrow-left.svg`, `star-filled.svg`, `search.svg`, `x-circle.svg`.

### 9. `MOB-009` — BTC/USDT Spot Candlestick Chart
* **Layout Structure**: Ticker Header Bar + Timeframe Selector Tabs (15m, 1h, 4h, 1D) + High-Precision SVG Candlestick Chart + Indicator Toolbar + Buy/Sell Action Bar.
* **Components**: Real-time Ticker Headings, Timeframe Chips, SVG Candlesticks (Green `#0ecb81` Bids & Red `#f6465d` Asks), Volume Bars, Indicator Pills (MA, EMA, RSI, MACD), Buy BTC (`.btn-primary`) & Sell BTC CTAs.
* **SVG Icons**: `candlestick.svg`, `maximize.svg`, `settings.svg`, `share.svg`.

### 10. `MOB-010` — Depth Orderbook & Trade Execution Drawer
* **Layout Structure**: Split Screen (Left Orderbook Depth / Right Order Entry Form) + Order Type Tabs (Limit, Market, Stop-Limit).
* **Components**: 6 Asks Red Rows + 6 Bids Green Rows, Percentage Quick Selectors ($25\%, 50\%, 75\%, 100\%$), Total Amount Input, Big `.btn-primary` Buy BTC CTA.
* **SVG Icons**: `layers.svg`, `info.svg`, `chevron-down.svg`.

### 11. `MOB-011` — Instant Fiat Buy (Apple Pay / Credit Card)
* **Layout Structure**: Currency Input Selector + Payment Method List + Fee Breakdown.
* **Components**: USD Input Field with Flag Icon, BTC Estimate Output, Apple Pay / Credit Card Payment Cards with Selection Checkmarks, Buy CTA.
* **SVG Icons**: `credit-card.svg`, `dollar-sign.svg`, `shield-check.svg`.

### 12. `MOB-012` — Convert & Zero-Fee Swap
* **Layout Structure**: From/To Swap Cards + Swap Flip Button + Quote Timer.
* **Components**: From USDT Input, Flip Order SVG Button, To ETH Output, Guaranteed Rate Timer (6s), Convert CTA.
* **SVG Icons**: `refresh-cw.svg`, `arrow-down-up.svg`, `zap.svg`.

### 13. `MOB-013` — Futures 125x Leverage Selector
* **Layout Structure**: Contract Header + Leverage Slider ($1\text{x}$ to $125\text{x}$) + Margin Ratio Meter + Long/Short CTAs.
* **Components**: Cross/Isolated Margin Selector, 125x Leverage Drag Slider, Liquidation Risk Bar, Open Long (`.btn-primary` Green) & Open Short (`.btn-danger` Red) CTAs.
* **SVG Icons**: `activity.svg`, `alert-triangle.svg`, `sliders.svg`.

### 14. `MOB-014` — Binance Earn Staking Vaults
* **Layout Structure**: Earn Hero Card + Flexible/Locked Staking List + Projected Yield Calculator.
* **Components**: APY Cards ($7.2\%$ USDT, $4.5\%$ ETH), Subscription Modal Input, Interest Auto-Compound Toggle.
* **SVG Icons**: `piggy-bank.svg`, `trending-up.svg`, `lock.svg`.

### 15. `MOB-015` — Spot Wallet Assets & Portfolio Chart
* **Layout Structure**: Wallet Balance Header + Quick Action Bar (Deposit, Withdraw, Transfer) + Asset Allocation Donut Chart + Asset Holdings List.
* **Components**: Total Balance Readout ($12,480.50 USDT), Hide Balance Eye Toggle, Action Buttons with SVG Icons, Asset Row Cards (BTC, ETH, USDT, SOL).
* **SVG Icons**: `eye.svg`, `download.svg`, `upload.svg`, `repeat.svg`, `pie-chart.svg`.

### 16. `MOB-016` — Deposit Crypto QR Code Scanner
* **Layout Structure**: Network Selector Dropdown (BNB Smart Chain, SegWit, Lightning) + Centered High-Res QR Code + Address Copy Bar.
* **Components**: Network Tabs, QR Code Container with Binance Diamond Watermark, Copy Address SVG Button, Share Address CTA.
* **SVG Icons**: `qr-code.svg`, `copy.svg`, `share-2.svg`, `alert-octagon.svg`.

### 17. `MOB-017` — Withdraw Crypto Address & Fee Check
* **Layout Structure**: Destination Address Field + Network Selection + Amount Slider + Fee & Security Warning.
* **Components**: Address Paste Button with Scan QR Icon, Network Fee Notice (0.0005 BTC), 2FA Confirmation Popup.
* **SVG Icons**: `send.svg`, `scan.svg`, `shield.svg`.

### 18. `MOB-018` — P2P Merchant Express List
* **Layout Structure**: Buy/Sell Filter Tabs + Fiat Currency Picker + Verified Merchant Feed.
* **Components**: Merchant Avatars with Verified Badge (`CryptoKing`, 99.8% completion), Payment Badges (Bank Transfer, Zelle, Wise), Express Buy CTA.
* **SVG Icons**: `shopping-bag.svg`, `check-badge.svg`, `filter.svg`.

### 19. `MOB-019` — Transaction History & Statement Export
* **Layout Structure**: Date Range Filter Bar + History Category Tabs (Orders, Deposits, Withdrawals, Trades) + Detailed Transaction List.
* **Components**: Filter Pills, Transaction List Items with Status Indicators (Completed, Pending, Failed), CSV Export CTA.
* **SVG Icons**: `calendar.svg`, `file-text.svg`, `download-cloud.svg`.

### 20. `MOB-020` — Account Security Settings & Anti-Phishing Code
* **Layout Structure**: Profile Header + Security Health Gauge (100% Protected) + Settings List Groups.
* **Components**: Anti-Phishing Code Field, Biometric FaceID Toggle, API Key Management Link, Change Password Drawer.
* **SVG Icons**: `shield-check.svg`, `key.svg`, `smartphone.svg`, `toggle-right.svg`, `chevron-right.svg`.
