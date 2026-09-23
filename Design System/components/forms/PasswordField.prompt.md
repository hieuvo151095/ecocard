Password entry with a text reveal toggle and an optional live rule checklist beneath.

```jsx
<PasswordField value={pw} revealed={show} onToggle={() => setShow(!show)} rules={[{label:'8 ký tự', met:true},{label:'1 chữ số'}]} />
```
