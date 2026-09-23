import React from 'react';

export function Uploader({ state = 'empty', src, disabled = false, hint = 'Tải ảnh lên', icon, onPick, onRemove, style, ...rest }) {
  const uploaded = state === 'uploaded' && src;
  return (
    <div
      onClick={disabled ? undefined : onPick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4x)',
        width: 104,
        height: 104,
        borderRadius: 'var(--radius-sm)',
        background: uploaded ? 'transparent' : disabled ? 'var(--color-alias-disabled)' : 'var(--color-legacy-gray10)',
        outline: uploaded ? 'none' : `1px dashed ${disabled ? 'rgba(0,0,0,.05)' : 'var(--color-alias-outline)'}`,
        outlineOffset: -1,
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {uploaded ? (
        <>
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }}
            aria-label="Remove"
            style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, border: 'none', borderRadius: 'var(--radius-full)', background: 'var(--color-alias-overlay)', color: 'var(--color-global-white)', fontSize: 12, cursor: 'pointer' }}
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <span style={{ display: 'inline-flex', width: 40, height: 40, color: 'var(--color-secondary-text)' }}>{icon}</span>
          <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-x-small)', color: 'var(--color-secondary-text)', textAlign: 'center', padding: '0 var(--space-4x)' }}>{hint}</span>
        </>
      )}
    </div>
  );
}

export default Uploader;
