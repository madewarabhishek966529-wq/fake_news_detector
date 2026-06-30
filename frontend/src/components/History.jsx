import { useEffect, useState } from 'react'
import api from '../api'

function HistoryItemSkeleton() {
  return (
    <div
      style={{
        background: 'rgba(22, 27, 39, 0.6)',
        border: '1px solid rgba(99, 120, 180, 0.1)',
        borderRadius: '0.875rem',
        padding: '1.25rem',
        animation: 'pulseSlow 2s ease-in-out infinite',
      }}
    >
      <div style={{ height: 14, width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 10 }} />
      <div style={{ height: 10, width: '90%', background: 'rgba(255,255,255,0.04)', borderRadius: 4, marginBottom: 6 }} />
      <div style={{ height: 10, width: '70%', background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
    </div>
  )
}

function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '1.25rem',
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <h3 style={{ color: '#e6eaf5', fontWeight: 600, marginBottom: 8, fontSize: '1.05rem' }}>
        No analyses yet
      </h3>
      <p style={{ color: '#8892b0', fontSize: '0.875rem', maxWidth: 300 }}>
        Head to the Dashboard and analyze your first news article to see results here.
      </p>
    </div>
  )
}

function HistoryItem({ item, index }) {
  const isFake = item.label === 'FAKE'
  const confidencePct = Math.round(item.confidence * 100)
  const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const timeStr = new Date(item.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div
      className="animate-slide-up glass-card"
      style={{
        padding: '1.25rem 1.5rem',
        animationDelay: `${index * 40}ms`,
        animationFillMode: 'both',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#e6eaf5',
              marginBottom: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title || (
              <span style={{ color: '#4a5568', fontStyle: 'italic' }}>Untitled article</span>
            )}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#8892b0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.text_snippet}
          </p>
        </div>

        {/* Badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '0.25rem 0.75rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            borderRadius: 9999,
            flexShrink: 0,
            color: isFake ? '#fca5a5' : '#86efac',
            background: isFake ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
            border: `1px solid ${isFake ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
          }}
        >
          {isFake ? '⚠️' : '✅'} {item.label}
        </span>
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
        {/* Confidence mini bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', maxWidth: 120 }}>
            <div
              style={{
                height: '100%',
                width: `${confidencePct}%`,
                borderRadius: 4,
                background: isFake
                  ? 'linear-gradient(90deg, #ef4444, #f97316)'
                  : 'linear-gradient(90deg, #22c55e, #34d399)',
              }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#8892b0', fontVariantNumeric: 'tabular-nums' }}>
            {confidencePct}% conf.
          </span>
        </div>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#4a5568' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {dateStr} · {timeStr}
        </div>
      </div>
    </div>
  )
}

export default function History() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/history')
        setItems(data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load history.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  // Stats from history
  const fakeCount = items.filter(i => i.label === 'FAKE').length
  const realCount = items.filter(i => i.label === 'REAL').length
  const avgConf = items.length > 0
    ? Math.round(items.reduce((s, i) => s + i.confidence, 0) / items.length * 100)
    : 0

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10" style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="font-display font-700" style={{ fontSize: '1.875rem', color: '#e6eaf5', marginBottom: 6 }}>
              Analysis History
            </h1>
            <p style={{ color: '#8892b0', fontSize: '0.9rem' }}>
              All your previous news credibility checks
            </p>
          </div>
          {!loading && items.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '0.375rem 0.875rem',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 9999, fontSize: '0.78rem', color: '#fca5a5', fontWeight: 600,
                }}
              >
                ⚠️ {fakeCount} FAKE
              </span>
              <span
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '0.375rem 0.875rem',
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: 9999, fontSize: '0.78rem', color: '#86efac', fontWeight: 600,
                }}
              >
                ✅ {realCount} REAL
              </span>
              {avgConf > 0 && (
                <span
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '0.375rem 0.875rem',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 9999, fontSize: '0.78rem', color: '#a5b4fc', fontWeight: 600,
                  }}
                >
                  📊 {avgConf}% avg conf.
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            color: '#fca5a5',
            marginBottom: 24,
          }}
        >
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <HistoryItemSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card-elevated">
          <EmptyState />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, idx) => (
            <HistoryItem key={item.id} item={item} index={idx} />
          ))}
        </div>
      )}
    </main>
  )
}
