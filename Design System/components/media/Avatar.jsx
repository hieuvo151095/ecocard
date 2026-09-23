import React from 'react';

const SIZES = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 };
const COLORS = ['#1A94FF', '#00AB56', '#FF9F41', '#FF424E', '#65AF00'];

function hue(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % COLORS.length;
  return COLORS[h];
}

export function Avatar({ src, name = '', size = 'md', shape = 'circle', bordered = false, style, ...rest }) {
  const px = SIZES[size] || SIZES.md;
  const radius = shape === 'circle' ? 'var(--radius-full)' : 'var(--radius-sm)';
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: px,
        height: px,
        borderRadius: radius,
        overflow: 'hidden',
        background: src ? 'var(--color-legacy-gray10)' : hue(name || 'A'),
        boxShadow: bordered ? '0 0 0 2px var(--color-alias-theme)' : 'none',
        fontFamily: 'var(--font-core)',
        fontSize: px * 0.4,
        fontWeight: 'var(--font-weight-medium)',
        color: 'var(--color-global-white)',
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </span>
  );
}

export default Avatar;
