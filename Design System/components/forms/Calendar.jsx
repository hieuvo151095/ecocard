import React from 'react';

const DOWS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function Calendar({
  month = 'Tháng 9, 2026',
  days = 30,
  startDow = 1,
  selected = [],
  disabledDays = [],
  type = 'single',
  onSelect,
  onPrev,
  onNext,
  style,
  ...rest
}) {
  const cells = [...Array(startDow).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const inRange = (d) => type === 'range' && selected.length === 2 && d > selected[0] && d < selected[1];
  return (
    <div style={{ width: 328, background: 'var(--color-alias-theme)', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32, padding: '0 var(--space-8x)' }}>
        <button type="button" onClick={onPrev} aria-label="Previous month" style={{ width: 32, height: 32, border: 'none', background: 'transparent', color: 'var(--color-primary-text)', cursor: 'pointer' }}>‹</button>
        <span style={{ fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary-text)' }}>{month}</span>
        <button type="button" onClick={onNext} aria-label="Next month" style={{ width: 32, height: 32, border: 'none', background: 'transparent', color: 'var(--color-primary-text)', cursor: 'pointer' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 40px)', justifyContent: 'center', paddingTop: 'var(--space-8x)' }}>
        {DOWS.map((d) => (
          <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, fontFamily: 'var(--font-core)', fontSize: 'var(--font-size-small)', color: 'var(--color-secondary-text)' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const isSel = d && selected.includes(d);
          const isDisabled = d && disabledDays.includes(d);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: 40, height: 58, background: inRange(d) ? 'var(--color-primary-blue10)' : 'transparent' }}>
              {d ? (
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelect && onSelect(d)}
                  style={{
                    width: 40,
                    height: 40,
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    background: isSel ? 'var(--color-global-blue60)' : 'transparent',
                    color: isSel ? 'var(--color-global-white)' : isDisabled ? 'var(--color-disable-text)' : 'var(--color-primary-text)',
                    fontFamily: 'var(--font-core)',
                    fontSize: 'var(--font-size-base)',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {d}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
