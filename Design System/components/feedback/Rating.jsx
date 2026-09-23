import React from 'react';

function Star({ status, size }) {
  const fill = status === 'no' ? 'var(--color-alias-outline)' : 'var(--color-alias-brand)';
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, color: fill, fontSize: size, lineHeight: 1 }}>
      <span style={{ position: 'absolute', inset: 0, color: 'var(--color-alias-outline)' }}>★</span>
      <span style={{ position: 'absolute', inset: 0, width: status === 'half' ? '50%' : status === 'full' ? '100%' : '0%', overflow: 'hidden', color: 'var(--color-alias-brand)' }}>★</span>
    </span>
  );
}

export function Rating({ value = 0, size = 'default', showValue = false, style, ...rest }) {
  const px = size === 'large' ? 24 : 16;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4x)', ...style }} {...rest}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={px} status={value >= i ? 'full' : value >= i - 0.5 ? 'half' : 'no'} />
      ))}
      {showValue ? <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-small)', color: 'var(--color-secondary-text)' }}>{value.toFixed(1)}</span> : null}
    </span>
  );
}

export default Rating;
