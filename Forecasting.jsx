import { useState } from 'react'
import { T, INVOICES } from '../constants.js'
import { Chip, ConfBar } from './UI.jsx'

const STATUS_META = {
  overdue:   { color: '#FF4D6A', label: 'Overdue'    },
  pending:   { color: '#FFB020', label: 'Pending'    },
  matched:   { color: '#00C67B', label: 'Matched'    },
  flagged:   { color: '#FF4D6A', label: '⚠ Flagged'  },
  scheduled: { color: '#00C8F0', label: 'Scheduled'  },
}

const TABS = [['all','All'],['ap','Accounts Payable'],['ar','Accounts Receivable'],['flagged','Flagged']]

export default function APARView() {
  const [tab, setTab] = useState('all')
  const filtered = tab === 'all' ? INVOICES
    : tab === 'flagged' ? INVOICES.filter(i => i.status === 'flagged')
    : INVOICES.filter(i => i.type === tab)

  return (
    <div style={{ padding: 26, animation: 'fadein .2s ease' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: T.textPrimary, letterSpacing: '-.02em' }}>AP / AR Management</div>
        <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>Invoice queue · AI-matched · Human review required for flagged items</div>
      </div>

      {/* Summary metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
          ['AP Outstanding', '$122.9K', '6 invoices', T.amber],
          ['AR Overdue',     '$80.3K',  '2 at risk',  T.red  ],
          ['Auto-Match Rate','94.2%',   'Avg conf 91%',T.green],
        ].map(([l, v, s, c]) => (
          <div key={l} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: T.textSec }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: c, fontFamily: "'JetBrains Mono', monospace", margin: '6px 0' }}>{v}</div>
            <div style={{ fontSize: 11, color: T.textSec }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}` }}>
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding: '11px 18px', border: 'none', borderBottom: `2px solid ${tab === k ? T.blue : 'transparent'}`, background: 'transparent', color: tab === k ? T.blue : T.textSec, fontSize: 13, fontWeight: tab === k ? 500 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}>
              {l}
            </button>
          ))}
        </div>

        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 90px 130px 140px 130px', padding: '9px 16px', borderBottom: `1px solid ${T.border}` }}>
          {['Invoice', 'Vendor', 'Amount', 'Status', 'AI Match', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 10, color: T.textMuted, letterSpacing: '.06em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {/* Data rows */}
        {filtered.map((inv, i) => {
          const s = STATUS_META[inv.status]
          const matchColor = inv.match >= 90 ? T.green : inv.match >= 70 ? T.amber : T.red
          return (
            <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 90px 130px 140px 130px', padding: '11px 16px', borderBottom: `1px solid ${T.border}`, alignItems: 'center', background: i % 2 === 0 ? 'transparent' : 'rgba(7,12,24,.4)' }}>
              <span style={{ fontSize: 12, color: T.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}>{inv.id}</span>
              <span style={{ fontSize: 13, color: T.textPrimary }}>{inv.vendor}</span>
              <span style={{ fontSize: 13, color: T.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}>${inv.amount.toLocaleString()}</span>
              <div>
                <Chip color={s.color}>{s.label}</Chip>
                <div style={{ fontSize: 10, color: T.textSec, marginTop: 3 }}>{inv.due}</div>
              </div>
              <ConfBar value={inv.match} color={matchColor} />
              <div style={{ display: 'flex', gap: 6 }}>
                {inv.status === 'flagged' ? (
                  <>
                    <button style={{ background: T.green + '22', color: T.green, border: `1px solid ${T.green}44`, borderRadius: 5, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Approve</button>
                    <button style={{ background: T.red + '22', color: T.red, border: `1px solid ${T.red}44`, borderRadius: 5, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Reject</button>
                  </>
                ) : (
                  <button style={{ background: T.blue + '22', color: T.blue, border: `1px solid ${T.blue}44`, borderRadius: 5, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>View</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
