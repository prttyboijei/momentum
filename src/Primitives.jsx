import { useState } from 'react';
import { C } from './tokens';

// ─── BTN ─────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', size = 'md', style: s = {}, disabled }) {
  const sz = {
    sm: { p: '6px 12px',  fs: 12 },
    md: { p: '10px 18px', fs: 14 },
    lg: { p: '13px 28px', fs: 15 },
  }[size];

  const vs = {
    primary: { background: C.accent,    color: '#07070A', fontWeight: 600 },
    ghost:   { background: 'transparent', color: C.textSub, border: `1px solid ${C.border}` },
    teal:    { background: C.tealDim,   color: C.teal,    border: `1px solid rgba(78,204,163,0.2)` },
    danger:  { background: 'rgba(232,80,80,0.08)', color: C.danger, border: `1px solid rgba(232,80,80,0.2)` },
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, borderRadius: 10, border: 'none',
        padding: sz.p, fontSize: sz.fs,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...vs, ...s,
      }}
    >
      {children}
    </button>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, style: s = {}, onClick, accent }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.card,
        border: `1px solid ${hover ? C.borderHover : accent ? C.accent + '33' : C.border}`,
        borderRadius: 16, padding: 20,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s',
        ...s,
      }}
    >
      {children}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = C.accent, height = 6 }) {
  return (
    <div style={{ background: C.surface, borderRadius: 99, height, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          background: `linear-gradient(90deg,${color}88,${color})`,
          borderRadius: 99,
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, color = C.accent, sub }) {
  const rgb =
    color === C.accent  ? '232,160,32'  :
    color === C.teal    ? '78,204,163'  :
    color === C.purple  ? '167,139,250' : '251,146,60';

  return (
    <Card style={{ flex: 1, minWidth: 130 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `rgba(${rgb},0.12)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color={color} />
        </div>
        <span style={{
          fontSize: 11, color: C.textMuted, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 600, color: C.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ icon: Icon, label, color }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: `${color}15`, border: `1px solid ${color}30`,
      borderRadius: 8, padding: '5px 12px', fontSize: 12, color, fontWeight: 500,
    }}>
      <Icon size={12} /> {label}
    </div>
  );
}