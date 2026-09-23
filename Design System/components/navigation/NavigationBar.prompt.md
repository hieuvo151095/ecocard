The screen-level top bar: 56px tall, 16px side margin, 24px leading glyph, title left or centred.

```jsx
<NavigationBar title="Chi tiết đơn hàng" leading={<Icon name="ArrowSmLeftTypeLine" size={24} />} actions={<Icon name="ASearchProperty1Line" size={24} />} />
<NavigationBar theme="brand" title="Ví của tôi" align="center" />
```

Variants: `theme` default | brand (yellow) | reverse (dark) · `transparent` for over-image bars · `align`.
