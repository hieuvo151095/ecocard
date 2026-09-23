import React from 'react';

export function Radio({ checked = false, disabled = false, label, name, onChange, style, ...rest }) {
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
            borderRadius: 'var(--radius-full)',
            background: disabled ? 'var(--color-alias-disabled)' : checked ? 'var(--color-global-blue60)' : 'var(--color-alias-theme)',
            boxShadow: checked && !disabled ? 'none' : 'inset 0 0 0 1px var(--color-alias-outline)',
          }}
        >
          {checked ? <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-global-white)' }} /> : null}
        </span>
      </span>
      <input type="radio" name={name} checked={checked} disabled={disabled} onChange={() => onChange && onChange(true)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      {label ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', color: 'var(--color-primary-text)' }}>{label}</span> : null}
    </label>
  );
}

export default Radio;
