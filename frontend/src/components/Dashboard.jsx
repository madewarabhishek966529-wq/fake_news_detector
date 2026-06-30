import PredictForm from './PredictForm.jsx'

function StatsCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: 'rgba(22, 27, 39, 0.6)',
        border: '1px solid rgba(99, 120, 180, 0.12)',
        borderRadius: '0.875rem',
        padding: '1.125rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '0.625rem',
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.72rem', color: '#8892b0', fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#e6eaf5', marginTop: 2 }}>{value}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10" style={{ flex: 1 }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '3px 10px',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 9999,
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#818cf8',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            ✦ AI-Powered Analysis
          </div>
        </div>
        <h1 className="font-display font-700" style={{ fontSize: '1.875rem', color: '#e6eaf5', marginBottom: 6 }}>
          News Truth Analyzer
        </h1>
        <p style={{ color: '#8892b0', fontSize: '0.9rem', maxWidth: 480 }}>
          Paste any news article below and our AI model will assess its credibility in seconds.
        </p>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 28,
        }}
      >
        <StatsCard icon="🧠" label="AI Model" value="TF-IDF + LR" color="#6366f1" />
        <StatsCard icon="⚡" label="Analysis Speed" value="< 1 second" color="#22c55e" />
        <StatsCard icon="🔍" label="Key Signals" value="Linguistic" color="#f59e0b" />
      </div>

      {/* Predict form */}
      <PredictForm />

      {/* Bottom tips */}
      <div
        style={{
          marginTop: 24,
          padding: '1rem 1.25rem',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.12)',
          borderRadius: '0.875rem',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#a5b4fc', marginBottom: 4 }}>
            Tips for best results
          </p>
          <p style={{ fontSize: '0.75rem', color: '#8892b0', lineHeight: 1.6 }}>
            Include the full article body, not just the headline. Longer texts with more context give the model more signals to work with and improve accuracy.
          </p>
        </div>
      </div>
    </main>
  )
}
