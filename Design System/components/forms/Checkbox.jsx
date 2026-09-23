import React from 'react';

export function Checkbox({ checked = false, indeterminate = false, disabled = false, label, onChange, style, ...rest }) {
  const on = checked || indeterminate;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-8x)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 'var(--opacity-disabled)' : 1, ...style }} {...rest}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, padding: 2, boxSizing: 'border-box' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: 'var(--radius-xs)',
            background: disabled ? 'var(--color-alias-disabled)' : on ? 'var(--color-global-blue60)' : 'var(--color-alias-theme)',
            boxShadow: on && !disabled ? 'none' : 'inset 0 0 0 1px var(--color-alias-outline)',
            color: 'var(--color-global-white)',
            fontSize: 13,
            lineHeight: 1,
          }}
        >
          {indeterminate ? '–' : checked ? '✓' : null}
        </span>
      </span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      {label ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', color: 'var(--color-primary-text)' }}>{label}</span> : null}
    </label>
  );
}

export default Checkbox;
