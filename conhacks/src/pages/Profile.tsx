import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface PersonalityProfile {
  title: string
  roast: string
  rage_clicks: number
  mash_events: number
  avg_page_ms: number
  generated_at: string
}

export default function Profile() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<PersonalityProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  async function loadProfile() {
    setLoadingProfile(true)

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      navigate('/login')
      return
    }

    setEmail(session.user.email ?? null)
    setUserId(session.user.id)

    const { data, error } = await supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (error) {
      console.error('Failed to load personality profile:', error)
      setProfile(null)
    } else {
      setProfile(data)
    }

    setLoadingProfile(false)
  }

  useEffect(() => {
    loadProfile()

    function handleProfileReady() {
      loadProfile()
    }

    window.addEventListener('profileReady', handleProfileReady)

    return () => {
      window.removeEventListener('profileReady', handleProfileReady)
    }
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleRecalibrate = async () => {
    if (!userId) return

    const { error } = await supabase
      .from('personality_profiles')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to recalibrate:', error)
      return
    }

    setProfile(null)
  }

  const initials = email ? email.slice(0, 2).toUpperCase() : '??'

  return (
    <div className="profile-page">
      <nav className="chaos-nav">
        <span className="nav-logo">CHAOS PLATFORM</span>
        <div className="nav-actions">
          <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </nav>

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-identity">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <div className="profile-email">{email ?? 'Loading...'}</div>
              <div className="profile-meta">// user profile</div>
            </div>
          </div>
        </div>

        <div className="personality-card">
          <div className="personality-label">Personality diagnosis</div>

          {loadingProfile ? (
            <p className="personality-empty">Loading your diagnosis...</p>
          ) : profile ? (
            <>
              <div className="personality-title">{profile.title}</div>
              <p className="personality-roast">{profile.roast}</p>
            </>
          ) : (
            <p className="personality-empty">
              No profile yet. Use the site for a bit —<br />
              we're watching. The diagnosis will find you.
            </p>
          )}
        </div>

        <div className="section-label">behavior stats</div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Rage clicks</div>
            <div className="stat-value" style={{ color: 'var(--neon-pink)', textShadow: '0 0 20px rgba(255,45,120,0.3)' }}>
              {profile?.rage_clicks ?? '—'}
            </div>
            <div className="stat-sub">consecutive rapid clicks</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Keyboard mash</div>
            <div className="stat-value" style={{ color: 'var(--neon-yellow)', textShadow: '0 0 20px rgba(255,230,0,0.3)' }}>
              {profile?.mash_events ?? '—'}
            </div>
            <div className="stat-sub">burst key events</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Avg time / page</div>
            <div className="stat-value">
              {profile?.avg_page_ms ? `${(profile.avg_page_ms / 1000).toFixed(1)}s` : '—'}
            </div>
            <div className="stat-sub">milliseconds averaged</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Profiled at</div>
            <div className="stat-value" style={{ fontSize: '18px', paddingTop: '8px', letterSpacing: '0px' }}>
              {profile?.generated_at
                ? new Date(profile.generated_at).toLocaleDateString()
                : '—'}
            </div>
            <div className="stat-sub">diagnosis timestamp</div>
          </div>
        </div>

        <div className="recalibrate-section">
          <button
            className="btn btn-outline"
            onClick={handleRecalibrate}
            disabled={!profile}
            style={{ opacity: profile ? 1 : 0.3 }}
          >
            Recalibrate
          </button>
          <p className="recalibrate-note">
            Wipes your personality profile and restarts behavior tracking.<br />
            We'll figure you out again.
          </p>
        </div>
      </main>
    </div>
  )
}