import { Activity, LayoutDashboard, MessageSquare, FileText, BarChart2, Brain } from 'lucide-react'
import { T } from '../constants.js'

const NAV = [
  { id: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard'      },
  { id: 'chat',       icon: MessageSquare,   label: 'AI Assistant'   },
  { id: 'apar',       icon: FileText,        label: 'AP / AR'        },
  { id: 'forecast',   icon: BarChart2,       label: 'Forecasting'    },
  { id: 'agents',     icon: Brain,           label: 'Agent Control', badge: '1' },
]

export default function Sidebar({ view, setView }) {
  return (
    <nav style={{
      width: 210, background: T.bgCard, borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'sticky', top: 0, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, letterSpacing: '-.01em' }}>ANFOS</div>
            <div style={{ fontSize: 9, color: T.textSec, letterSpacing: '.1em' }}>FINANCIAL OS</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ padding: '10px 8px', flex: 1 }}>
        {NAV.map(({ id, icon: Icon, label, badge }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', marginBottom: 2, borderRadius: 8, border: 'none',
                cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                background: active ? T.blueGlow : 'transparent',
                color: active ? T.blue : T.textSec,
                fontSize: 13, fontWeight: active ? 500 : 400, transition: 'all .15s',
              }}
            >
              <Icon size={15} />
              {label}
              {badge && (
                <span style={{ marginLeft: 'auto', background: '#FF4D6A33', color: '#FF4D6A', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* User */}
      <div style={{ padding: 14, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.blue + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: T.blue, flexShrink: 0 }}>
            JD
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: T.textPrimary }}>Jordan Davis</div>
            <div style={{ fontSize: 10, color: T.textSec }}>Series A · 7.2mo runway</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
