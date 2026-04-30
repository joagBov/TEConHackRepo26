import { Link } from 'react-router-dom'

const PREVIEW_PROJECTS = [
  {
    tag: 'AI · Voice',
    title: 'Voice Companion',
    desc: 'Talk to an AI that talks back. Has opinions. Judges your decisions. Still useful.',
    status: 'live',
    index: '01',
  },
  {
    tag: 'AI · Tools',
    title: 'Idea Validator',
    desc: 'Paste your idea. Get brutally honest feedback. Claude will not lie to spare your feelings.',
    status: 'soon',
    index: '02',
  },
  {
    tag: 'AI · Fun',
    title: 'Roast Generator',
    desc: 'Submit anything. Resume, startup pitch, life choices. We will roast it.',
    status: 'soon',
    index: '03',
  },
]

export default function Landing() {
  return (
    <div className="landing-page">

      {/* ── Nav ── */}
      <nav className="chaos-nav">
        <span className="nav-logo">CHAOS PLATFORM</span>
        <div className="nav-actions">
          <Link to="/login"  className="btn btn-ghost">Login</Link>
          <Link to="/signup" className="btn btn-outline">Sign up</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <p className="hero-eyebrow">// welcome to the chaos</p>

        <h1 className="hero-title">
          CHAOS<br />
          <span className="accent">PLATFORM</span>
        </h1>

        <p className="hero-tagline">
          Useful tools wrapped in intentional chaos.
        </p>

        <div className="chaos-ticker">
          ⚠ WARNING: this site may behave unexpectedly. that is a feature.
        </div>

        <div className="hero-actions">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Enter →
          </Link>
          <Link to="/login"  className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-ghost">Sign up</Link>
        </div>
      </section>

      {/* ── Project preview cards ── */}
      <section className="landing-projects">
        <div className="landing-projects-label">projects inside</div>

        <div className="project-cards-grid">
          {PREVIEW_PROJECTS.map((p) => (
            <div className="preview-card" key={p.title} data-index={p.index}>
              <span className="preview-card-tag">{p.tag}</span>
              <h3 className="preview-card-title">{p.title}</h3>
              <p className="preview-card-desc">{p.desc}</p>
              <div className="preview-card-status">
                <span className={`status-dot ${p.status === 'soon' ? 'soon' : ''}`} />
                <span style={{ color: p.status === 'live' ? 'var(--neon-green)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  {p.status === 'live' ? 'live' : 'coming soon'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}