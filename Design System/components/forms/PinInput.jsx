import React from 'react';

export function PinInput({
  length = 4,
  value = '',
  secret = true,
  state = 'empty',
  disabled = false,
  error = false,
  style,
  ...rest
}) {
  const cells = Array.from({ length });
  const activeIndex = Math.min(value.length, length - 1);
  return (
    <div style={{ display: 'flex', gap: 'var(--space-8x)', width: length > 4 ? 280 : 184, ...style }} {...rest}>
      {cells.map((_, i) => {
        const filled = i < value.length;
        const focused = !disabled && state !== 'empty' && i === activeIndex && !filled;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-xs)',
              background: disabled ? 'var(--color-alias-disabled)' : 'var(--color-alias-theme)',
              boxShadow: error
                ? 'inset 0 0 0 1px var(--color-alias-negative)'
                : focused
                ? 'inset 0 0 0 1px var(--color-global-blue60)'
                : 'inset 0 0 0 1px var(--color-alias-outline)',
              fontFamily: 'var(--font-core)',
              fontSize: 'var(--font-size-medium)',
              color: 'var(--color-alias-reverse-theme)',
              boxSizing: 'border-box',
            }}
          >
            {filled && secret ? (
              <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-alias-reverse-theme)' }} />
            ) : filled ? (
              value[i]
            ) : focused ? (
              <span style={{ width: 1, height: 18, background: 'var(--color-global-blue60)' }} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default PinInput;
