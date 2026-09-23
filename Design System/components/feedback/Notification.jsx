import React from 'react';

export function Notification({ open = true, title = 'Title', body, image, primaryLabel = 'Đồng ý', secondaryLabel, onPrimary, onSecondary, style, ...rest }) {
  if (!open) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 360, height: 640, padding: '0 var(--space-16x)', background: 'var(--color-alias-overlay)', boxSizing: 'border-box', ...style }} {...rest}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', borderRadius: 'var(--radius-md)', background: 'var(--color-alias-theme)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-16x)', padding: 'var(--space-16x)' }}>
          <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-medium)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary-text)', textAlign: 'center' }}>{title}</span>
          {image ? <img src={image} alt="" style={{ width: 128, height: 128, objectFit: 'contain' }} /> : null}
          {body ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', color: 'var(--color-secondary-text)', textAlign: 'center' }}>{body}</span> : null}
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid #D3D9E0' }}>
          {secondaryLabel ? (
            <button type="button" onClick={onSecondary} style={{ flex: 1, height: 52, border: 'none', borderRight: '1px solid #D3D9E0', background: 'transparent', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-medium)', color: 'var(--color-secondary-text)', cursor: 'pointer' }}>{secondaryLabel}</button>
          ) : null}
          <button type="button" onClick={onPrimary} style={{ flex: 1, height: 52, border: 'none', background: 'transparent', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-medium)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-alias-hyperlink)', cursor: 'pointer' }}>{primaryLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default Notification;
