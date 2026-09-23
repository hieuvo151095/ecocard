104px square image upload tile — dashed outline when empty, full-bleed preview with a remove pill once filled. Lay several out in a grid with `gap: var(--space-8x)`.

```jsx
<Uploader icon={<Icon name="Camera" size={40} />} onPick={pick} />
<Uploader state="uploaded" src={photo} onRemove={remove} />
```
