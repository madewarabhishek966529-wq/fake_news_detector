export default function ResultCard({ result }) {
  if (!result) return null

  const isFake = result.label === 'FAKE'
  const confidencePct = Math.round(result.confidence * 100)

  const verdict = isFake ? 'FAKE' : 'REAL'
  const icon = isFake ? '⚠️' : '✅'
  const label = isFake ? 'Likely Misinformation' : 'Likely Credible'
  const sublabel = isFake
    ? 'Our model detected patterns commonly associated with misleading content.'
    : 'Our model found patterns consistent with credible reporting.'

  const cardBorderColor = isFake ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.25)'
  const cardBg = isFake ? 'rgba(239, 68, 68, 0.05)' : 'rgba(34, 197, 94, 0.05)'
  const glowColor = isFake ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)'
  const accentColor = isFake ? '#ef4444' : '#22c55e'
  const accentColorLight = isFake ? '#fca5a5' : '#86efac'
  const fillClass = isFake ? 'progress-fill-fake' : 'progress-fill-real'

  return (
    <div
      style={{
        background: `rgba(13, 17, 23, 0.95)`,
        border: `1px solid ${cardBorderColor}`,
        borderRadius: '1.25rem',
        padding: '2rem',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: `0 0 40px ${glowColor}, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '0.875rem',
              background: isFake
                ? 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.3))'
                : 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.3))',
              border: `1px solid ${cardBorderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3
                className="font-display font-700"
                style={{ fontSize: '1.25rem', color: accentColorLight }}
              >
                {label}
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#8892b0' }}>{sublabel}</p>
          </div>
        </div>

        {/* Verdict badge */}
        <span className={isFake ? 'badge-fake' : 'badge-real'} style={{ flexShrink: 0 }}>
          {isFake ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4l7.39 14H4.61L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          )}
          {verdict}
        </span>
      </div>

      {/* Confidence meter */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '0.875rem',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#8892b0' }}>
            Model Confidence
          </span>
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: accentColorLight,
              fontVariantNumeric: 'tabular-nums',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {confidencePct}%
          </span>
        </div>

        <div className="progress-track" style={{ height: 8 }}>
          <div
            className={`progress-fill ${fillClass}`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: '0.68rem', color: '#4a5568' }}>Low confidence</span>
          <span style={{ fontSize: '0.68rem', color: '#4a5568' }}>High confidence</span>
        </div>
      </div>

      {/* Key terms */}
      {result.explanation && result.explanation.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8892b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#8892b0' }}>
              Key influencing terms
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {result.explanation.map((term, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: accentColorLight,
                  background: isFake ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                  border: `1px solid ${cardBorderColor}`,
                  borderRadius: 9999,
                  fontFamily: 'monospace',
                }}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          fontSize: '0.72rem',
          color: '#4a5568',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        This is an AI-generated assessment. Always verify news through multiple trusted sources.
      </div>
    </div>
  )
}
