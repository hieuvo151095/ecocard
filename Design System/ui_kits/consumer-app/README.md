# ECO Consumer App UI kit

Clickable recreation of the Consumer app flow implied by the file's Bottom-Navigation-Consumer + Button + Chip + Text-field + Rating components: Home (search, category chips, product grid) → Product detail (rating, quantity stepper) → Checkout (address, payment method radio) → Success.

Copy is in Vietnamese per the file's real strings ("Trang chủ", "Khám phá", "Đơn hàng", "Ví của tôi", "Thanh toán"). Category chip labels ("Bia · Nước giải khát", "Sữa các loại", "Mì ăn liền", "Dầu ăn") are taken directly from the Logo-brand page's category frame names, since the file groups its brand-logo examples by exactly these grocery categories.

This kit hand-rolls its own small Button/Chip/Stepper copies (rather than importing `components/`) so the single HTML file stays dependency-free for the Design System tab preview; production use should import the real `components/actions/Button.jsx` etc. instead.
