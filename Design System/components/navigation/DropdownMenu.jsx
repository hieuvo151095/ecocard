import React from 'react';

export function DropdownMenu({ items = [], selectedId, onSelect, width = 328, style, ...rest }) {
  return (
    <div
      role="menu"
      style={{
        width,
        maxHeight: 200,
        overflowY: 'auto',
        padding: 'var(--space-4x) 0',
        borderRadius: 'var(--radius-xs)',
        background: 'var(--color-alias-theme)',
        boxShadow: '0 1px 4px 0 rgba(0,0,0,.2)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => onSelect && onSelect(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-8x)',
              width: '100%',
              height: 40,
              padding: '0 var(--space-16x)',
              border: 'none',
              background: selected ? 'var(--color-alias-theme-variant)' : 'transparent',
              fontFamily: 'var(--font-core)',
              fontSize: 'var(--font-size-base)',
              fontWeight: selected ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
              color: item.disabled ? 'var(--color-disable-text)' : 'var(--color-primary-text)',
              textAlign: 'left',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {item.icon ? <span style={{ display: 'inline-flex', width: 20, height: 20, color: 'var(--color-secondary-text)' }}>{item.icon}</span> : null}
            <span style={{ flex: 1 }}>{item.label}</span>
            {selected ? <span style={{ color: 'var(--color-global-blue60)' }}>✓</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default DropdownMenu;
