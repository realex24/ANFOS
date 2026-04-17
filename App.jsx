import { useState, useRef, useEffect, useCallback } from 'react'
import { Brain, User, Send } from 'lucide-react'
import { T, SYSTEM_PROMPT } from '../constants.js'

const SUGGESTIONS = [
  "Why did our cash flow drop this week?",
  "What if we hire 3 engineers at $150K?",
  "Show R&D credit qualification status",
  "Which AR invoices are at highest risk?",
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: isUser ? T.blue + '33' : T.bgCard, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {isUser ? <User size={13} color={T.blue} /> : <Brain size={13} color={T.cyan} />}
      </div>
      <div style={{ maxWidth: '72%', background: isUser ? T.blue + '22' : T.bgCard, border: `1px solid ${isUser ? T.blue + '44' : T.border}`, borderRadius: 12, padding: '12px 16px', fontSize: 13, color: T.textPrimary, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
        {msg.content}
      </div>
    </div>
  )
}

function LoadingBubble() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.bgCard, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Brain size={13} color={T.cyan} />
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T.blue, animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
    </div>
  )
}

export default function ChatView() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: "Hello! I'm your ANFOS AI Financial Assistant with live access to your financial data. Ask me anything — cash flow, scenario planning, AP/AR, tax, or compliance." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = useCallback(async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')
    const newMsgs = [...msgs, { role: 'user', content: q }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          system: SYSTEM_PROMPT,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMsgs(prev => [...prev, { role: 'assistant', content: data.content?.[0]?.text || 'Error retrieving response.' }])
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }, [input, msgs, loading])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', animation: 'fadein .2s ease' }}>
      {/* Header */}
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blue + '33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={18} color={T.blue} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.textPrimary }}>ANFOS AI Financial Assistant</div>
          <div style={{ fontSize: 11, color: T.textSec }}>● Live data · NLQ mode · Claude-powered</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {msgs.length === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 13px', color: T.textSec, fontSize: 12, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.4 }}>
                "{s}"
              </button>
            ))}
          </div>
        )}
        {msgs.map((m, i) => <Message key={i} msg={m} />)}
        {loading && <LoadingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px 24px', borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, background: T.bgCard, border: `1px solid ${T.borderMed}`, borderRadius: 12, padding: '10px 14px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask anything about your finances…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.textPrimary, fontSize: 13, fontFamily: 'inherit' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{ background: input.trim() && !loading ? T.blue : T.border, color: input.trim() && !loading ? '#fff' : T.textMuted, border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', transition: 'all .15s', flexShrink: 0 }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
