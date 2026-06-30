import { useState } from 'react'
import api from '../api'
import ResultCard from './ResultCard.jsx'

function NewspaperIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  )
}

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  )
}

export default function PredictForm() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const MIN_CHARS = 20
  const MAX_CHARS = 5000

  const handleTextChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS)
    setText(val)
    setCharCount(val.length)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (text.trim().length < MIN_CHARS) {
      setError(`Article text must be at least ${MIN_CHARS} characters long.`)
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/predict', { title, text })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100)
  const charColor = charCount < MIN_CHARS ? '#ef4444' : charCount > MAX_CHARS * 0.9 ? '#f97316' : '#22c55e'

  return (
    <div>
      {/* Analyze form */}
      <div className="glass-card-elevated p-8 glow-accent">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.35))',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#818cf8',
            }}
          >
            <NewspaperIcon />
          </div>
          <div>
            <h2 className="font-display font-600" style={{ color: '#e6eaf5', fontSize: '1.125rem' }}>
              Analyze Article
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#8892b0' }}>
              Paste any news article to detect misinformation
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '0.875rem 1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '0.625rem',
              fontSize: '0.825rem',
              color: '#fca5a5',
              marginBottom: '1.25rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#8892b0', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
              Headline <span style={{ color: '#4a5568', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              id="article-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="e.g. Scientists Discover New Planet in Solar System"
            />
          </div>

          {/* Article text */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#8892b0', letterSpacing: '0.02em' }}>
                Article Text <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <span style={{ fontSize: '0.72rem', color: charColor, fontVariantNumeric: 'tabular-nums' }}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
            <textarea
              id="article-text"
              required
              rows={10}
              value={text}
              onChange={handleTextChange}
              className="input-field"
              placeholder="Paste the full article text here. The AI model will analyze linguistic patterns, source reliability signals, and contextual cues to determine authenticity..."
            />
            {/* char progress */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
              <div className="progress-track" style={{ flex: 1, height: 3 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${charPercent}%`,
                    background: charCount < MIN_CHARS
                      ? 'linear-gradient(90deg, #ef4444, #f87171)'
                      : 'linear-gradient(90deg, #6366f1, #a78bfa)',
                  }}
                />
              </div>
              {charCount < MIN_CHARS && (
                <span style={{ fontSize: '0.7rem', color: '#ef4444', whiteSpace: 'nowrap' }}>
                  {MIN_CHARS - charCount} more needed
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              type="submit"
              id="analyze-btn"
              disabled={loading || charCount < MIN_CHARS}
              className="btn-primary"
              style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ScanIcon />
                  Analyze Article
                </>
              )}
            </button>

            {(title || text) && (
              <button
                type="button"
                onClick={() => { setTitle(''); setText(''); setCharCount(0); setResult(null); setError('') }}
                className="btn-ghost"
                style={{ fontSize: '0.825rem' }}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="animate-slide-up" style={{ marginTop: '1.5rem' }}>
          <ResultCard result={result} />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: '1.5rem',
            padding: '2rem',
            borderRadius: '1.25rem',
            background: 'rgba(22, 27, 39, 0.8)',
            border: '1px solid rgba(99, 120, 180, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '3px solid rgba(99,102,241,0.2)',
              borderTopColor: '#6366f1',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#8892b0', fontSize: '0.875rem' }}>
              AI is analyzing the article...
            </p>
            <p style={{ color: '#4a5568', fontSize: '0.75rem', marginTop: 4 }}>
              Scanning linguistic patterns and credibility signals
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
