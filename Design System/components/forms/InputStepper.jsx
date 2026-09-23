import React from 'react';

function StepButton({ label, onClick, disabled, shape }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label === '−' ? 'Decrement' : 'Increment'}
      style={{
        width: 40,
        height: 40,
        border: 'none',
        borderRadius: shape === 'pill' ? 'var(--radius-full)' : 'var(--radius-xs)',
        background: disabled ? 'var(--color-alias-disabled)' : 'var(--color-alias-brand)',
        color: 'var(--color-global-black)',
        fontFamily: 'var(--font-core)',
        fontSize: 'var(--font-size-medium)',
        fontWeight: 'var(--font-weight-medium)',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  );
}

export function InputStepper({ value = 1, min = 0, max = 99, shape = 'rounded', readOnly = false, disabled = false, onChange, style, ...rest }) {
  const set = (v) => onChange && onChange(Math.max(min, Math.min(max, v)));
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 'var(--space-4x)', width: 128, height: 40, ...style }} {...rest}>
      <StepButton label="−" shape={shape} disabled={disabled || value <= min} onClick={() => set(value - 1)} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-xs)',
          background: 'var(--color-alias-theme)',
          boxShadow: 'inset 0 0 0 1px var(--color-alias-outline)',
          fontFamily: 'var(--font-core)',
          fontSize: 'var(--font-size-base)',
          color: readOnly ? 'var(--color-secondary-text)' : 'var(--color-primary-text)',
        }}
      >
        {value}
      </div>
      <StepButton label="+" shape={shape} disabled={disabled || value >= max} onClick={() => set(value + 1)} />
    </div>
  );
}

export default InputStepper;
