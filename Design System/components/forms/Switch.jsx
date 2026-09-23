import React from 'react';

export function Switch({ checked = false, disabled = false, label, onChange, style, ...rest }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-8x)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 'var(--opacity-disabled)' : 1, ...style }} {...rest}>
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: 40,
          height: 24,
          borderRadius: 'var(--radius-full)',
          background: disabled ? 'var(--color-alias-disabled)' : checked ? 'var(--color-global-blue60)' : 'var(--color-alias-outline)',
          transition: 'background-color var(--duration-base) var(--ease-standard)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 20,
            height: 20,
            borderRadius: 16,
            background: 'var(--color-global-white)',
            transition: 'left var(--duration-base) var(--ease-standard)',
          }}
        />
      </span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      {label ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', color: 'var(--color-primary-text)' }}>{label}</span> : null}
    </label>
  );
}

export default Switch;
