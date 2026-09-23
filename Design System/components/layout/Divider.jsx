import React from 'react';

export function Divider({ orientation = 'horizontal', thickness = 'thin', style, ...rest }) {
  const thick = thickness === 'thick';
  const isH = orientation === 'horizontal';
  return (
    <div
      style={{
        width: isH ? '100%' : thick ? 8 : 1,
        height: isH ? (thick ? 8 : 1) : '100%',
        background: thick ? '#C4C4C4' : 'var(--color-alias-outline-variant)',
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    />
  );
}

export default Divider;
