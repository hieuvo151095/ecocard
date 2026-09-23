import React from 'react';

export function Overlay({ visible = true, strength = 'scrim', children, onClick, style, ...rest }) {
  if (!visible) return null;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: strength === 'strong' ? 'rgba(0,0,0,.7)' : 'var(--color-alias-overlay)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Overlay;
