The modal container for ECO: a bottom sheet for pickers and confirmations, a centre sheet for short dialogs. Both sit on the 40% black scrim.

```jsx
<Sheet placement="bottom" title="Chọn phương thức" footer={<ButtonBar primaryLabel="Xác nhận" />} onClose={close}>
  {options}
</Sheet>
```

Variants: `placement` bottom | center · `navAction` close | back | none · `handle`.
