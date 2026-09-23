import React from 'react';

const SIZES = {
  small: { height: 32, padding: '6px 12px', font: 'var(--font-size-small)', icon: 16 },
  medium: { height: 40, padding: '8px 16px', font: 'var(--font-size-base)', icon: 20 },
  large: { height: 48, padding: '12px 16px', font: 'var(--font-size-medium)', icon: 24 },
};

const RADII = { default: 'var(--radius-sm)', border: 'var(--radius-sm)', round: 'var(--radius-round)' };

export function Button({
  children,
  type = 'soil',
  size = 'medium',
  shape = 'default',
  contentType = 'text only',
  leadingIcon,
  trailingIcon,
  disabled = false,
  pressed = false,
  fullWidth = false,
  onClick,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.medium;
  const iconOnly = contentType === 'icon only';
  const base = {
    display: 'inline-flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: s.height,
    padding: iconOnly ? 0 : s.padding,
    width: iconOnly ? s.height : fullWidth ? '100%' : undefined,
    borderRadius: RADII[shape] || RADII.default,
    border: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-core)',
    fontSize: s.font,
    fontWeight: 'var(--font-weight-medium)',
    lineHeight: 'var(--font-height-default)',
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color var(--duration-fast) var(--ease-standard)',
    boxSizing: 'border-box',
  };

  let skin;
  if (disabled) {
    skin = { background: 'var(--color-alias-disabled)', color: 'var(--color-primary-text)', opacity: 'var(--opacity-disabled)' };
  } else if (type === 'soil') {
    skin = { background: pressed ? 'var(--color-alias-brand-pressed)' : 'var(--color-alias-brand)', color: 'var(--color-global-black)' };
  } else if (type === 'outline') {
    skin = { boxShadow: 'inset 0 0 0 1px var(--color-global-black)', color: 'var(--color-primary-text)', background: pressed ? 'var(--state-press-overlay)' : 'transparent' };
  } else {
    skin = { color: 'var(--color-primary-text)', background: pressed ? 'var(--state-press-overlay)' : 'transparent' };
  }

  return (
    <button type="button" disabled={disabled} onClick={onClick} style={{ ...base, ...skin, ...style }} {...rest}>
      {contentType === 'leading icon' && leadingIcon}
      {iconOnly ? leadingIcon : children}
      {contentType === 'trailing icon' && trailingIcon}
    </button>
  );
}

export default Button;
