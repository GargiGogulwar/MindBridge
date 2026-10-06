import { useState, useEffect } from 'react';
import { loginUser, signInWithEmail } from '../lib/storage';
import { getUserId } from '../lib/api';

const AVATARS = ['😊', '🌟', '💙', '🌿', '🦋', '🌸', '🌈', '🧠', '☀️', '🌙', '🎵', '🌻'];
const ROLES = [
  { id: 'student', label: 'Student', emoji: '📚', desc: 'Managing school stress & emotions' },
  { id: 'individual', label: 'Individual', emoji: '🧘', desc: 'Personal wellness & mental health' },
  { id: 'caregiver', label: 'Caregiver', emoji: '🤝', desc: 'Supporting someone I care for' },
];

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function Login({ onLogin }: any) {
  const [mode, setMode] = useState('landing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('😊');
  const [role, setRole] = useState('individual');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!name.trim()) { setError('Please enter your name to continue.'); return; }
    if (name.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
    setLoading(true);
    try {
      const profile = { name: name.trim(), avatar, role, email: email.toLowerCase().trim() };
      loginUser(profile);
      onLogin(profile);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    try {
      const restored = await signInWithEmail(email.trim());
      if (restored) {
        onLogin(restored);
      } else {
        setError('No account found with that email. Please create a new profile.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: any = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1.5px solid var(--border)', background: 'var(--surface2)',
    color: 'var(--txt)', fontFamily: 'inherit', fontSize: '0.9rem',
    outline: 'none', transition: 'border-color 0.18s', boxSizing: 'border-box',
  };

  const cardStyle: any = {
    width: '100%', maxWidth: 480, background: 'var(--card-bg)',
    border: '1px solid var(--border)', borderRadius: 24, padding: '36px',
    backdropFilter: 'blur(20px)', boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <video autoPlay loop muted playsInline onLoadedData={() => setVideoLoaded(true)}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: videoLoaded ? 0.18 : 0, transition: 'opacity 2s', zIndex: 0 }}
        src="/forest-rain.mp4" />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(10,16,20,0.7) 0%, rgba(10,16,20,0.5) 50%, rgba(10,16,20,0.9) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', opacity: animIn ? 1 : 0, transform: animIn ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>

        {/* ── LANDING ── */}
        {mode === 'landing' && (
          <div style={{ textAlign: 'center', maxWidth: 520 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px', background: 'linear-gradient(135deg, var(--teal), var(--sage))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 8px 32px rgba(78,205,196,0.35)' }}>🧠</div>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Mind<span style={{ color: 'var(--teal)' }}>Bridge</span>+
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--txt2)', marginBottom: 10, lineHeight: 1.6 }}>Your personal AI-powered mental wellness companion</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--txt3)', marginBottom: 36 }}>Emotion tracking · AI chat · Breathing exercises · Crisis support</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
              {['🎙️ Voice mood logging', '🤖 AI companion', '🌬️ Breathing exercises', '📊 Mood insights', '🆘 Crisis resources'].map(f => (
                <span key={f} style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)', color: 'var(--teal)', fontSize: '0.78rem', fontWeight: 600 }}>{f}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 340, margin: '0 auto' }}>
              <button className="btn-primary" onClick={() => setMode('signup')} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
                ✨ Create My Profile
              </button>
              <button className="btn-ghost" onClick={() => setMode('signin')} style={{ width: '100%', justifyContent: 'center' }}>
                Sign in with my email
              </button>
            </div>
            <p style={{ marginTop: 24, fontSize: '0.72rem', color: 'var(--txt3)', lineHeight: 1.6 }}>Your data is private and synced to your account · No ads</p>
          </div>
        )}

        {/* ── SIGN UP ── */}
        {mode === 'signup' && (
          <div style={cardStyle}>
            <button onClick={() => { setMode('landing'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--txt3)', cursor: 'pointer', fontSize: '0.82rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', padding: 0 }}>← Back</button>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{avatar}</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Create Your Profile</h2>
              <p style={{ fontSize: '0.83rem', color: 'var(--txt3)' }}>Your email keeps your data synced across devices</p>
            </div>
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Avatar */}
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--txt3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Choose your avatar</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                  {AVATARS.map(a => (
                    <button key={a} type="button" onClick={() => setAvatar(a)} style={{ fontSize: 26, padding: '8px 4px', borderRadius: 12, border: 'none', cursor: 'pointer', background: avatar === a ? 'rgba(78,205,196,0.15)' : 'var(--surface2)', outline: avatar === a ? '2px solid var(--teal)' : '2px solid transparent', outlineOffset: 1, transition: 'all 0.18s' }}>{a}</button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--txt3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  style={inputStyle}
                  autoFocus
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--txt3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="What should we call you?"
                  style={inputStyle}
                  maxLength={30}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Role */}
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--txt3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>I'm using MindBridge as a…</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ROLES.map(r => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, cursor: 'pointer', background: role === r.id ? 'rgba(78,205,196,0.1)' : 'var(--surface2)', border: `1.5px solid ${role === r.id ? 'rgba(78,205,196,0.5)' : 'var(--border)'}`, color: 'var(--txt)', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.18s' }}>
                      <div style={{ fontSize: 24, flexShrink: 0 }}>{r.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: role === r.id ? 'var(--teal)' : 'var(--txt)' }}>{r.label}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--txt3)', marginTop: 1 }}>{r.desc}</div>
                      </div>
                      {role === r.id && <div style={{ marginLeft: 'auto', color: 'var(--teal)', fontWeight: 800 }}>✓</div>}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 12, padding: '10px 14px', color: 'var(--crimson)', fontSize: '0.83rem' }}>{error}</div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ Creating profile…' : `${avatar} Start My Wellness Journey`}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--txt3)', lineHeight: 1.6 }}>
                Already have a profile?{' '}
                <button type="button" onClick={() => { setMode('signin'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', fontWeight: 700, padding: 0 }}>Sign in instead</button>
              </p>
            </form>
          </div>
        )}

        {/* ── SIGN IN ── */}
        {mode === 'signin' && (
          <div style={cardStyle}>
            <button onClick={() => { setMode('landing'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--txt3)', cursor: 'pointer', fontSize: '0.82rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', padding: 0 }}>← Back</button>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>👋</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>Welcome back!</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--txt3)', lineHeight: 1.5 }}>Enter your email to restore your profile<br />and mood history from any device</p>
            </div>
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--txt3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Your email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  style={{ ...inputStyle, fontSize: '1rem', padding: '13px 16px' }}
                  autoFocus
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {error && (
                <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 12, padding: '12px 16px', color: 'var(--crimson)', fontSize: '0.85rem', lineHeight: 1.5 }}>{error}</div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ Looking up your account…' : '✉️ Sign In with Email'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--txt3)', fontWeight: 600 }}>NEW HERE?</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              <button type="button" className="btn-ghost" onClick={() => { setMode('signup'); setError(''); }} style={{ width: '100%', justifyContent: 'center' }}>
                ✨ Create a new profile
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
