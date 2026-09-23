import React from 'react';

const SKINS = {
  neutral: { bg: 'rgba(39,39,42,.9)', fg: 'var(--color-global-white)' },
  informative: { bg: 'rgba(39,39,42,.9)', fg: 'var(--color-global-white)' },
  positive: { bg: 'var(--color-alias-positive)', fg: 'var(--color-global-white)' },
  negative: { bg: 'var(--color-global-red-alt)', fg: 'var(--color-global-white)' },
};

export function Toast({ message = 'Message', type = 'neutral', actionLabel, onAction, icon, style, ...rest }) {
  const skin = SKINS[type] || SKINS.neutral;
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-8x)',
        width: 328,
        padding: 'var(--space-8x)',
        borderRadius: 'var(--radius-xs)',
        background: skin.bg,
        boxShadow: 'var(--elevation-toast)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {icon ? <span style={{ display: 'inline-flex', width: 20, height: 20, color: skin.fg }}>{icon}</span> : null}
      <span style={{ flex: 1, padding: '0 var(--space-8x)', fontFamily: 'var(--font-legacy)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--font-height-default)', color: skin.fg }}>{message}</span>
      {actionLabel ? (
        <button type="button" onClick={onAction} style={{ height: 32, padding: '0 var(--space-12x)', border: 'none', borderRadius: 'var(--radius-xs)', background: 'rgba(255,255,255,.16)', color: skin.fg, fontFamily: 'var(--font-legacy)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>{actionLabel}</button>
      ) : null}
    </div>
  );
}

export default Toast;
