import React from 'react';

export function DocTable({ columns = ['Token name', 'Value'], rows = [], style, ...rest }) {
  return (
    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--elevation-outline)', ...style }} {...rest}>
      <div style={{ display: 'flex' }}>
        {columns.map((c) => (
          <div key={c} style={{ flex: 1, padding: 'var(--space-16x)', background: 'var(--color-alias-theme-variant)', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary-text)', boxSizing: 'border-box' }}>{c}</div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', borderTop: '1px solid var(--color-alias-outline-variant)' }}>
          {row.map((cell, j) => (
            <div key={j} style={{ flex: 1, padding: 'var(--space-16x)', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', color: 'var(--color-secondary-text)', boxSizing: 'border-box' }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default DocTable;
