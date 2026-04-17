import { useState } from 'react'
import { T, AGENTS } from '../constants.js'
import { Chip, Dot, ConfBar } from './UI.jsx'

const AUTO_LABELS = ['—', 'Assisted', 'Semi-Auto', 'Fully Auto']
const AUTO_COLORS = [T.textMuted, T.blue, T.cyan, T.green]

export default function AgentsView() {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ padding: 26, animation: 'fadein .2s ease' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: T.textPrimary, letterSpacing: '-.02em' }}>Agent Control Center</div>
        <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>5 specialized agents · Real-time status · Progressive autonomy controls</div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
        {[
          ['Tasks Today',       '337',   T.blue  ],
          ['Avg Confidence',    '92.4%', T.green ],
          ['HITL Escalations',  '3',     T.amber ],
          ['Auto-Executed',     '312',   T.cyan  ],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: T.textSec }}>{l}</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Agent cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {AGENTS.map(ag => {
          const sc = ag.status === 'active' ? T.green : ag.status === 'alert' ? T.red : T.amber
          const mc = ag.conf >= 90 ? T.green : ag.conf >= 75 ? T.amber : T.red
          const open = selected === ag.id

          return (
            <div key={ag.id} onClick={() => setSelected(open ? null : ag.id)} style={{ background: T.bgCard, border: `1px solid ${open ? T.blue : T.border}`, borderRadius: 12, padding: 18, cursor: 'pointer', transition: 'border-color .15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blue + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="15" height="15" fill="none" stroke={T.blue} strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.textPrimary }}>{ag.name}</div>
                    <div style={{ fontSize: 11, color: T.textSec, marginTop: 1 }}>{ag.tasks} tasks today</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Dot color={sc} pulse={ag.status !== 'alert'} />
                  <span style={{ fontSize: 10, color: sc, fontWeight: 500, letterSpacing: '.05em' }}>{ag.status.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.textSec, marginBottom: 5 }}>
                  <span>Confidence Score</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ag.conf}%</span>
                </div>
                <ConfBar value={ag.conf} color={mc} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 4, letterSpacing: '.06em' }}>AUTONOMY</div>
                  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    {[1, 2, 3].map(l => (
                      <div key={l} style={{ width: 20, height: 4, borderRadius: 2, background: l <= ag.auto ? AUTO_COLORS[ag.auto] : T.border, transition: 'background .2s' }} />
                    ))}
                    <span style={{ fontSize: 10, color: AUTO_COLORS[ag.auto], marginLeft: 6, fontWeight: 500 }}>{AUTO_LABELS[ag.auto]}</span>
                  </div>
                </div>
                {ag.status === 'alert' && <Chip color={T.red}>Action Required</Chip>}
              </div>

              {open && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 6, letterSpacing: '.06em' }}>LATEST ACTIVITY</div>
                  <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>{ag.recent}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
