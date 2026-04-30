import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { generatePersonalityProfile } from "../api/gemini";
import { getSummary } from '../hooks/useTracker';

// Replace with useContext(RageContext) once Dev A's provider is wired in
const useRagebait = () => {
  const [enabled, setEnabled] = useState(false)
  const toggle = () => setEnabled((v) => !v)
  return { enabled, toggle }
}

const PROJECTS = [
  {
    id: 'companion',
    icon: '🎙',
    title: 'Voice Companion',
    desc: 'An AI that listens, responds, and quietly judges you. Powered by Claude + ElevenLabs.',
    route: '/companion',
    live: true,
  },
  {
    id: 'validator',
    icon: '💀',
    title: 'Idea Validator',
    desc: 'Is your idea stupid? Find out. Claude will tell you with zero filter.',
    route: '/validator',
    live: false,
  },
  {
    id: 'roast',
    icon: '🔥',
    title: 'Roast Generator',
    desc: 'Paste anything. We will make it burn. Constructive destruction.',
    route: '/roast',
    live: false,
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { enabled: rageEnabled, toggle: toggleRage } = useRagebait()
  const [diagnosis, setDiagnosis] = useState<{ title: string; roast: string } | null>(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  async function testGemini() {
  try {
    const summary = getSummary(); 

    console.log("Tracker summary:", summary);

    const profile = await generatePersonalityProfile(summary);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    await supabase.from("personality_profiles").upsert({
      user_id: userData.user.id,
      title: profile.title,
      roast: profile.roast,
      rage_clicks: summary.rageClicks,
      mash_events: summary.mashEvents,
      avg_page_ms: summary.timeOnSiteSeconds * 1000,
      generated_at: new Date().toISOString(),
    });

    setDiagnosis(profile);
  } catch (error) {
    console.error("Gemini failed:", error);
  }
}

  return (
    <div className="dashboard-page">

      {/* ── Nav ── */}
      <nav className="chaos-nav">
        <span className="nav-logo">PLATFORM</span>
        <div className="nav-actions">
          <Link to="/profile" className="btn btn-ghost">Profile</Link>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </nav>

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-greeting">// you're in</p>
          <h1 className="dashboard-title">Dashboard</h1>
        </div>

        <div className="dashboard-actions">
          <button
            className={`ragebait-toggle ${rageEnabled ? 'active' : ''}`}
            onClick={toggleRage}
            title="Toggle ragebait mode"
          >
            <span className="toggle-indicator" />
            {rageEnabled ? '😈 Ragebait: ON' : '😇 Ragebait: OFF'}
          </button>

          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      {/* ── Projects grid ── */}
      <main className="dashboard-main">
        <div className="section-label">projects</div>

        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <div className="project-card" key={p.id}>
              <div className="project-card-header">
                <div className="project-card-icon">{p.icon}</div>
                <span className={`project-card-badge ${p.live ? 'badge-live' : 'badge-soon'}`}>
                  {p.live ? 'live' : 'soon'}
                </span>
              </div>

              <div className="project-card-title">{p.title}</div>
              <div className="project-card-desc">{p.desc}</div>

              <div className="project-card-footer">
                <button
                  className="btn-open"
                  disabled={!p.live}
                  onClick={() => p.live && navigate(p.route)}
                >
                  {p.live ? `Open ${p.title} →` : 'Coming soon'}
                </button>
              </div>
            </div>
          ))}

                  <div className="diagnosis-test-card">
                      <p className="section-label">Personality scan</p>

                      <button onClick={testGemini} className="neon-button">
                          {diagnosisLoading ? "Analyzing..." : "Test Gemini Diagnosis"}
                      </button>

                      {diagnosisError && <p className="error-text">{diagnosisError}</p>}

                      {diagnosis && (
                          <div className="diagnosis-popup">
                              <p className="section-label">Diagnosis complete</p>
                              <h3>{diagnosis.title}</h3>
                              <p>{diagnosis.roast}</p>
                          </div>
                      )}
                  </div>
        </div>
      </main>

    </div>
  )
}


