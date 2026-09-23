The standard ECO single-line input: 56px tall, 8px radius, label shrinks to 12px once the field holds a value.

```jsx
<TextField label="Số điện thoại" required value={phone} onChange={setPhone} state="typing" />
<TextField label="Số tiền" prefix="VND" error message="Số tiền không hợp lệ" />
```

Variants: `state` empty | focus | typing | filled · `error` / `warning` recolour the ring and message · `prefix` / `suffix` slots · `disabled`.
