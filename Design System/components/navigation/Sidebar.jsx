import React from 'react';

export function Sidebar({ items = [], activeId, collapsed = false, onSelect, style, ...rest }) {
  return (
    <nav style={{ width: collapsed ? 88 : 200, background: 'var(--color-legacy-gray10)', boxSizing: 'border-box', ...style }} {...rest}>
      {items.map((item) => {
        const active = item.id === activeId;
        const childActive = (item.children || []).some((c) => c.id === activeId);
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => onSelect && onSelect(item.id)}
              style={{
                display: 'flex',
                flexDirection: collapsed ? 'column' : 'row',
                alignItems: 'center',
                gap: collapsed ? 'var(--space-4x)' : 'var(--space-8x)',
                width: '100%',
                height: collapsed ? 59 : 40,
                padding: collapsed ? 'var(--space-8x)' : '8px var(--space-16x)',
                border: 'none',
                background: active || childActive ? 'var(--color-alias-theme)' : 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ display: 'inline-flex', width: 24, height: 24, color: active ? 'var(--color-primary-text)' : 'var(--color-secondary-text)' }}>{item.icon}</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-core)', fontSize: collapsed ? 'var(--font-size-x-small)' : 'var(--font-size-base)', fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)', color: active ? 'var(--color-primary-text)' : 'var(--color-secondary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
              {!collapsed && item.children ? <span style={{ color: 'var(--color-secondary-text)', fontSize: 12 }}>▾</span> : null}
            </button>
            {!collapsed && item.children && (active || childActive)
              ? item.children.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelect && onSelect(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      height: 40,
                      padding: '8px var(--space-16x) 8px 48px',
                      border: 'none',
                      background: c.id === activeId ? 'var(--color-alias-theme)' : 'transparent',
                      fontFamily: 'var(--font-core)',
                      fontSize: 'var(--font-size-base)',
                      color: c.id === activeId ? 'var(--color-primary-text)' : 'var(--color-secondary-text)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    {c.label}
                  </button>
                ))
              : null}
          </div>
        );
      })}
    </nav>
  );
}

export default Sidebar;
