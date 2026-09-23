import React from 'react';

export function NavigationBar({
  title = 'Title',
  subtitle,
  theme = 'default',
  transparent = false,
  align = 'left',
  leading,
  actions,
  style,
  ...rest
}) {
  const reverse = theme === 'reverse';
  const bg = transparent ? 'transparent' : theme === 'brand' ? 'var(--color-alias-brand)' : reverse ? 'var(--color-alias-reverse-theme)' : 'var(--color-alias-theme)';
  const fg = reverse ? 'var(--color-alias-primary-on-reverse-theme)' : 'var(--color-primary-text)';
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-8x)',
        width: 360,
        minHeight: 56,
        padding: '0 var(--space-16x)',
        background: bg,
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {leading ? <span style={{ display: 'inline-flex', width: 24, height: 24, color: fg, flexShrink: 0 }}>{leading}</span> : null}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start' }}>
        <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-large)', fontWeight: 'var(--font-weight-medium)', color: fg, lineHeight: 'var(--font-height-default)' }}>{title}</span>
        {subtitle ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-small)', color: reverse ? 'var(--color-alias-secondary-on-reverse-theme)' : 'var(--color-secondary-text)' }}>{subtitle}</span> : null}
      </div>
      {actions ? <div style={{ display: 'flex', gap: 'var(--space-16x)', alignItems: 'center', color: fg, flexShrink: 0 }}>{actions}</div> : null}
    </header>
  );
}

export default NavigationBar;
