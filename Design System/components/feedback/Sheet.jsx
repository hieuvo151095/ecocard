import React from 'react';

export function Sheet({
  open = true,
  placement = 'bottom',
  title,
  description,
  handle = true,
  navAction = 'close',
  children,
  footer,
  onClose,
  style,
  ...rest
}) {
  if (!open) return null;
  const bottom = placement === 'bottom';
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: bottom ? 'flex-end' : 'center', alignItems: 'center', width: 360, height: 640, background: 'var(--color-alias-overlay)', ...style }} {...rest}>
      <div
        style={{
          width: bottom ? 360 : 328,
          maxHeight: bottom ? 621 : 480,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: bottom ? '8px 8px 0 0' : 'var(--radius-md)',
          background: 'var(--color-alias-theme)',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {bottom && handle ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8x) 0 var(--space-4x)' }}>
            <span style={{ width: 40, height: 4, borderRadius: 'var(--radius-full)', background: 'var(--color-alias-outline)' }} />
          </div>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-8x)', padding: 'var(--space-16x)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4x)' }}>
            {title ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-large)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary-text)' }}>{title}</span> : null}
            {description ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', color: 'var(--color-secondary-text)' }}>{description}</span> : null}
          </div>
          {navAction !== 'none' ? (
            <button type="button" onClick={onClose} aria-label="Close" style={{ width: 24, height: 24, border: 'none', background: 'transparent', color: 'var(--color-primary-text)', fontSize: 14, cursor: 'pointer' }}>{navAction === 'back' ? '‹' : '✕'}</button>
          ) : null}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-16x)' }}>{children}</div>
        {footer ? <div style={{ padding: 'var(--space-16x)' }}>{footer}</div> : null}
      </div>
    </div>
  );
}

export default Sheet;
