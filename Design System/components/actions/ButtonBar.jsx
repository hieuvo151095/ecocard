import React from 'react';
import { Button } from './Button.jsx';

export function ButtonBar({
  primaryLabel = 'Primary',
  secondaryLabel,
  direction = 'horizontal',
  size = 'large',
  onPrimary,
  onSecondary,
  style,
  ...rest
}) {
  const horizontal = direction === 'horizontal';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        gap: 'var(--space-8x)',
        padding: 'var(--space-16x)',
        background: 'var(--color-alias-theme)',
        boxShadow: 'inset 0 1px 0 var(--color-alias-outline-variant)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {secondaryLabel ? (
        <Button type="outline" size={size} fullWidth onClick={onSecondary} style={{ flex: horizontal ? 1 : undefined }}>
          {secondaryLabel}
        </Button>
      ) : null}
      <Button type="soil" size={size} fullWidth onClick={onPrimary} style={{ flex: horizontal ? 1 : undefined }}>
        {primaryLabel}
      </Button>
    </div>
  );
}

export default ButtonBar;
