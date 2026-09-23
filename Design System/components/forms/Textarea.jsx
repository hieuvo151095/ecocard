import React from 'react';

export function Textarea({
  label = 'Label',
  value = '',
  placeholder = '',
  rows = 4,
  maxLength,
  disabled = false,
  error = false,
  message,
  onChange,
  style,
  ...rest
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4x)', width: 328, ...style }} {...rest}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 'var(--space-8x) var(--space-16x)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-alias-theme)',
          boxShadow: error ? 'inset 0 0 0 1px var(--color-alias-negative)' : 'inset 0 0 0 1px var(--color-alias-outline)',
          opacity: disabled ? 'var(--opacity-disabled)' : 1,
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-small)', color: 'var(--color-secondary-text)' }}>{label}</span>
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{ border: 'none', outline: 'none', resize: 'none', background: 'transparent', padding: 0, fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--font-height-default)', color: 'var(--color-primary-text)' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 var(--space-16x)', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-small)', color: error ? 'var(--color-alias-negative)' : 'var(--color-secondary-text)' }}>
        <span>{message}</span>
        {maxLength ? <span>{`${(value || '').length}/${maxLength}`}</span> : null}
      </div>
    </div>
  );
}

export default Textarea;
