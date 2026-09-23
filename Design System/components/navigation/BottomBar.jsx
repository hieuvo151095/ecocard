import React from 'react';

export function BottomBar({ items = [], activeIndex = 0, onSelect, homeIndicator = false, style, ...rest }) {
  return (
    <nav style={{ width: 360, background: 'var(--color-alias-theme)', boxShadow: 'inset 0 1px 0 #D3D9E0', boxSizing: 'border-box', ...style }} {...rest}>
      <div style={{ display: 'flex', height: 68 }}>
        {items.map((item, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect && onSelect(i)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-4x)',
                padding: '12px 4px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ display: 'inline-flex', width: 24, height: 24, color: active ? 'var(--color-primary-text)' : 'var(--color-secondary-text)' }}>{item.icon}</span>
              <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-x-small)', fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)', color: active ? 'var(--color-primary-text)' : 'var(--color-secondary-text)' }}>{item.label}</span>
            </button>
          );
        })}
      </div>
      {homeIndicator ? <div style={{ height: 29, background: 'var(--color-alias-theme)' }} /> : null}
    </nav>
  );
}

export default BottomBar;
