import React from 'react';

const ARROWS = {
  top: { bottom: -4, left: 'calc(50% - 4px)', transform: 'rotate(180deg)' },
  bottom: { top: -4, left: 'calc(50% - 4px)' },
  left: { right: -4, top: 'calc(50% - 2px)', transform: 'rotate(90deg)' },
  right: { left: -4, top: 'calc(50% - 2px)', transform: 'rotate(-90deg)' },
};

export function Tooltip({ children = 'Text', position = 'top', dismissible = true, onClose, style, ...rest }) {
  return (
    <div
      role="tooltip"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--radius-xs)',
        background: 'var(--color-alias-reverse-theme)',
        boxShadow: 'var(--elevation-tooltip)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ padding: 'var(--space-4x) var(--space-8x)', fontFamily: 'var(--font-legacy)', fontSize: 'var(--font-size-small)', lineHeight: 'var(--font-height-default)', color: 'var(--color-global-white)' }}>{children}</span>
      {dismissible ? (
        <button type="button" onClick={onClose} aria-label="Close" style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 4px 5px 0', border: 'none', background: 'transparent', color: 'var(--color-global-white)', fontSize: 11, cursor: 'pointer' }}>✕</button>
      ) : null}
      <span
        style={{
          position: 'absolute',
          width: 8,
          height: 4,
          background: 'var(--color-alias-reverse-theme)',
          clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
          ...ARROWS[position],
        }}
      />
    </div>
  );
}

export default Tooltip;
