In-page section switcher. Active tab is bold ECO blue with a 2px underline; idle is #808089 regular. Add `badge` for an unread dot.

```jsx
<Tab items={[{label:'Tất cả'},{label:'Đang giao', badge:true},{label:'Hoàn thành'}]} activeIndex={1} onSelect={setTab} />
```
