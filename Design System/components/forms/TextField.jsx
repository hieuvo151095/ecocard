import React from 'react';

const FIELD = {
  display: 'flex',
  alignItems: 'center',
  minHeight: 56,
  borderRadius: 'var(--radius-sm)',
  background: 'var(--color-alias-theme)',
  boxSizing: 'border-box',
};

export function TextField({
  label = 'Label',
  value = '',
  placeholder = '',
  state = 'empty',
  required = false,
  disabled = false,
  error = false,
  warning = false,
  helperText,
  message,
  prefix,
  suffix,
  onChange,
  style,
  ...rest
}) {
  const focused = state === 'focus' || state === 'typing';
  const ring = disabled
    ? 'inset 0 0 0 1px var(--color-alias-outline-variant)'
    : error
    ? 'inset 0 0 0 1px var(--color-alias-negative)'
    : warning
    ? 'inset 0 0 0 1px var(--color-alias-warning)'
    : focused
    ? 'inset 0 0 0 1px var(--color-global-blue60)'
    : 'inset 0 0 0 1px var(--color-alias-outline)';
  const raised = focused || (value && value.length > 0) || state === 'filled';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4x)', width: 328, ...style }} {...rest}>
      <div style={{ ...FIELD, boxShadow: ring, opacity: disabled ? 'var(--opacity-disabled)' : 1, padding: '4px 0' }}>
        {prefix ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8x)', height: 40, padding: '8px var(--space-16x)', borderRight: '1px solid var(--color-alias-outline)', fontSize: 'var(--font-size-base)', color: 'var(--color-primary-text)' }}>{prefix}</div>
        ) : null}
        <label style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '0 var(--space-16x)', gap: 2 }}>
          <span style={{ display: 'flex', gap: 2, fontFamily: 'var(--font-core)', fontSize: raised ? 'var(--font-size-small)' : 'var(--font-size-base)', color: disabled ? 'var(--color-disable-text)' : 'var(--color-secondary-text)', lineHeight: 'var(--font-height-default)' }}>
            {label}
            {required ? <span style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-alias-negative)' }}>*</span> : null}
          </span>
          {raised ? (
            <input
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              onChange={(e) => onChange && onChange(e.target.value)}
              style={{ border: 'none', outline: 'none', padding: 0, background: 'transparent', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', color: 'var(--color-primary-text)', lineHeight: 'var(--font-height-default)' }}
            />
          ) : null}
        </label>
        {suffix ? <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-16x)', color: 'var(--color-secondary-text)' }}>{suffix}</div> : null}
      </div>
      {(message || helperText) ? (
        <span style={{ padding: '0 var(--space-16x)', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-small)', color: error ? 'var(--color-alias-negative)' : warning ? 'var(--color-alias-warning)' : 'var(--color-secondary-text)' }}>
          {message || helperText}
        </span>
      ) : null}
    </div>
  );
}

export default TextField;
