import React from 'react';

export function Search({
  value = '',
  placeholder = 'Tìm kiếm',
  shape = 'rounded',
  disabled = false,
  showClear,
  onChange,
  onClear,
  leadingIcon,
  style,
  ...rest
}) {
  const clear = showClear === undefined ? Boolean(value) : showClear;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-8x)',
        width: 328,
        height: 40,
        padding: '0 var(--space-12x)',
        borderRadius: shape === 'pill' ? 'var(--radius-full)' : 'var(--radius-sm)',
        background: 'var(--color-alias-theme-variant)',
        boxShadow: 'inset 0 0 0 1px var(--color-alias-outline)',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'inline-flex', width: 20, height: 20, color: 'var(--color-secondary-text)' }}>{leadingIcon}</span>
      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', color: 'var(--color-primary-text)' }}
      />
      {clear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, border: 'none', borderRadius: 'var(--radius-full)', background: 'var(--color-alias-outline)', color: 'var(--color-global-white)', fontSize: 12, cursor: 'pointer' }}
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export default Search;
