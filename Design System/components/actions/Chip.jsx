import React from 'react';

export function Chip({
  children,
  active = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  image,
  onClick,
  style,
  ...rest
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-4x)',
        height: 32,
        padding: '0 var(--space-8x)',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: active ? 'var(--color-primary-blue10)' : 'var(--color-alias-theme)',
        boxShadow: active
          ? 'inset 0 0 0 1px var(--color-global-blue60)'
          : 'inset 0 0 0 1px var(--color-alias-outline)',
        color: disabled ? 'var(--color-disable-text)' : active ? 'var(--color-global-blue60)' : 'var(--color-primary-text)',
        fontFamily: 'var(--font-core)',
        fontSize: 'var(--font-size-base)',
        fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
        lineHeight: 'var(--font-height-default)',
        whiteSpace: 'nowrap',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {image ? (
        <img src={image} alt="" style={{ width: 24, height: 24, borderRadius: 'var(--radius-full)', objectFit: 'cover', marginLeft: -4 }} />
      ) : null}
      {leadingIcon ? <span style={{ display: 'inline-flex', width: 16, height: 16 }}>{leadingIcon}</span> : null}
      {children}
      {trailingIcon ? <span style={{ display: 'inline-flex', width: 16, height: 16 }}>{trailingIcon}</span> : null}
    </button>
  );
}

export default Chip;
