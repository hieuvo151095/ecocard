import React from 'react';
import { TextField } from './TextField.jsx';

export function PasswordField({ label = 'Mật khẩu', value = '', revealed = false, disabled = false, error = false, message, rules, onChange, onToggle, style, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8x)', width: 328, ...style }}>
      <TextField
        label={label}
        value={revealed ? value : '•'.repeat(value.length)}
        state={value ? 'filled' : 'empty'}
        disabled={disabled}
        error={error}
        message={message}
        onChange={onChange}
        suffix={
          <button
            type="button"
            onClick={onToggle}
            style={{ border: 'none', background: 'transparent', padding: 0, color: 'var(--color-secondary-text)', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-small)', cursor: 'pointer' }}
          >
            {revealed ? 'Ẩn' : 'Hiện'}
          </button>
        }
        {...rest}
      />
      {rules && rules.length ? (
        <ul style={{ margin: 0, padding: '0 var(--space-16x)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4x)' }}>
          {rules.map((r) => (
            <li key={r.label} style={{ display: 'flex', gap: 'var(--space-8x)', alignItems: 'center', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-small)', color: r.met ? 'var(--color-alias-positive)' : 'var(--color-secondary-text)' }}>
              <span style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: r.met ? 'var(--color-alias-positive)' : 'var(--color-alias-outline)' }} />
              {r.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default PasswordField;
