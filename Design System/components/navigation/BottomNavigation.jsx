import React from 'react';

export function BottomNavigation({
  items = [
    { label: 'Trang chủ' },
    { label: 'Khám phá' },
    { label: 'Đơn hàng' },
    { label: 'Ví của tôi' },
  ],
  activeIndex = 0,
  centerAction,
  onSelect,
  style,
  ...rest
}) {
  const left = items.slice(0, 2);
  const right = items.slice(2);
  const Item = ({ item, index }) => {
    const active = index === activeIndex;
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => onSelect && onSelect(index)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 9,
          width: 64,
          padding: '12px 4px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'inline-flex', width: 24, height: 24, color: active ? 'var(--color-bottomnav-active, #3E4559)' : '#7587A6' }}>{item.icon}</span>
        <span style={{ fontFamily: 'var(--font-legacy)', fontSize: 11, fontWeight: active ? 700 : 400, color: active ? '#3E4559' : '#7587A6', whiteSpace: 'nowrap' }}>{item.label}</span>
      </button>
    );
  };
  return (
    <nav style={{ position: 'relative', width: 360, height: 90, ...style }} {...rest}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: 360,
          height: 68,
          padding: '0 10px',
          background: 'var(--color-alias-theme)',
          boxShadow: '0 -0.5px 0 0 #D3D9E0, 0 -2px 4px 0 rgba(0,0,0,.08)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex' }}>{left.map((item, i) => <Item key={item.label} item={item} index={i} />)}</div>
        <div style={{ display: 'flex' }}>{right.map((item, i) => <Item key={item.label} item={item} index={i + 2} />)}</div>
      </div>
      {centerAction ? (
        <div style={{ position: 'absolute', left: 150, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-yellow-eco)', color: 'var(--color-global-black)' }}>
            {centerAction.icon}
          </span>
          <span style={{ fontFamily: 'var(--font-legacy)', fontSize: 11, color: '#7587A6' }}>{centerAction.label}</span>
        </div>
      ) : null}
    </nav>
  );
}

export default BottomNavigation;
