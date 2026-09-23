import React from 'react';

export function Tab({ items = [], activeIndex = 0, topIcon = false, onSelect, style, ...rest }) {
  return (
    <div role="tablist" style={{ display: 'flex', ...style }} {...rest}>
      {items.map((item, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect && onSelect(i)}
            style={{
              display: 'flex',
              flexDirection: topIcon ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4x)',
              minHeight: topIcon ? 61 : 45,
              padding: '12px var(--space-16x)',
              border: '1px solid var(--color-alias-outline-variant)',
              borderBottom: active ? '2px solid var(--color-global-blue60)' : '1px solid var(--color-alias-outline-variant)',
              background: 'var(--color-alias-theme)',
              fontFamily: 'var(--font-core)',
              fontSize: 'var(--font-size-base)',
              fontWeight: active ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
              color: active ? 'var(--color-global-blue60)' : 'var(--color-legacy-gray60)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {item.icon ? <span style={{ display: 'inline-flex', width: 20, height: 20 }}>{item.icon}</span> : null}
            {item.label}
            {item.badge ? <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-global-red60)', boxShadow: '0 0 0 1px var(--color-global-white)' }} /> : null}
          </button>
        );
      })}
    </div>
  );
}

export default Tab;
