import React from 'react';

export function Badge({ type = 'dot', children, style, ...rest }) {
  if (type === 'dot') {
    return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-global-red60)', boxShadow: '0 0 0 1px var(--color-global-white)', ...style }} {...rest} />;
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 26,
        height: 16,
        padding: '0.5px var(--space-4x)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-global-red60)',
        fontFamily: 'var(--font-legacy)',
        fontSize: 'var(--font-size-small)',
        fontWeight: 'var(--font-weight-bold)',
        lineHeight: '16px',
        color: 'var(--color-global-black)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge;
