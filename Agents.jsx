import { T } from '../constants.js'

export function Chip({ color, children }) {
  return (
    <span style={{
      background: color + '22', color, border: `1px solid ${color}44`,
      borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500,
      letterSpacing: '0.04em', display: 'inline-block',
    }}>
      {children}
    </span>
  )
}

export function Dot({ color, pulse }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
      {pulse && (
        <span style={{
          position: 'absolute', width: 8, height: 8, borderRadius: '50%',
          background: color, opacity: 0.4, animation: 'ping 1.5s ease-in-out infinite',
        }} />
      )}
      <span style={{
        position: 'relative', width: 8, height: 8, borderRadius: '50%', background: color,
      }} />
    </span>
  )
}

export function ConfBar({ value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: T.border, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 2, transition: 'width .6s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: T.textSec, minWidth: 34, fontFamily: "'JetBrains Mono', monospace" }}>
        {value}%
      </span>
    </div>
  )
}

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.borderMed}`, borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: 12, color: T.textSec, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color || T.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}>
          {p.name}: ${p.value?.toFixed(0)}K
        </div>
      ))}
    </div>
  )
}
