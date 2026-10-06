import { useState, useEffect } from 'react';
import { getSettings, saveSettings, saveUser, getUser, getAuthUser, getSettingsAsync } from '../lib/storage';
import { useAiStatus } from '../hooks/useAiStatus';

export default function Settings({ setUser, onLogout }: any) {
  const aiAvailable = useAiStatus();
  const [settings, setSettings] = useState(getSettings);
  const [saved, setSaved] = useState(false);

  const [confirmLogout, setConfirmLogout] = useState(false);
  const authUser = getAuthUser();

  useEffect(() => {
    getSettingsAsync().then(s => { if (s) setSettings(s); });
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    const user = getUser();
    const updated = { ...user, name: settings.userName };
    saveUser(updated);
    setUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ROLE_LABELS: Record<string, string> = { student: '📚 Student', individual: '🧘 Individual', caregiver: '🤝 Caregiver' };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--txt)' }}>👤 Profile</h3>
          {authUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, padding: '14px 16px', background: 'var(--surface2)', borderRadius: 14 }}>
              <div style={{ fontSize: 40 }}>{authUser.avatar || '😊'}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{authUser.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--txt3)', marginTop: 2 }}>{ROLE_LABELS[authUser.role] || '🧘 Individual'}</div>
                {authUser.email && (
                  <div style={{ fontSize: '0.73rem', color: 'var(--teal)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ✉️ <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{authUser.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <label style={{ display: 'block', marginBottom: 6, fontSize: '0.82rem', color: 'var(--txt3)', fontWeight: 600 }}>Display Name</label>
          <input type="text" value={settings.userName} onChange={e => setSettings((s: any) => ({ ...s, userName: e.target.value }))} className="input-field" style={{ width: '100%' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--teal)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--txt)' }}>🔔 Notifications</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div onClick={() => setSettings((s: any) => ({ ...s, notifications: !s.notifications }))} style={{ width: 44, height: 24, borderRadius: 12, position: 'relative', cursor: 'pointer', background: settings.notifications ? 'var(--teal)' : 'var(--surface3)', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: settings.notifications ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--txt)' }}>Daily mood check-in reminders</span>
          </label>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--txt)' }}>🧑‍⚕️ Caregiver Settings</h3>
          <label style={{ display: 'block', marginBottom: 6, fontSize: '0.82rem', color: 'var(--txt3)', fontWeight: 600 }}>Caregiver Email (for crisis alerts)</label>
          <input type="email" value={settings.caregiverEmail} onChange={e => setSettings((s: any) => ({ ...s, caregiverEmail: e.target.value }))} placeholder="caregiver@email.com" className="input-field" style={{ width: '100%' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--teal)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
          <p style={{ fontSize: '0.75rem', color: 'var(--txt3)', marginTop: 6 }}>Caregivers will receive alerts when crisis-level moods are detected.</p>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--txt)' }}>🤖 AI Integration</h3>
          {aiAvailable === true ? (
            <div style={{ padding: '12px 16px', background: 'rgba(78,205,196,0.08)', borderRadius: 12, border: '1px solid rgba(78,205,196,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--teal)' }}>Groq AI is active</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--txt3)', marginTop: 2 }}>Powered by Groq · Your key stays on the server</div>
              </div>
            </div>
          ) : aiAvailable === false ? (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--txt2)', marginBottom: 12, lineHeight: 1.6 }}>
                The server cannot reach Groq AI right now. Mood check-ins and chat will use their offline responses until the connection is restored.
              </p>
              <div style={{ padding: 12, background: 'rgba(78,205,196,0.08)', borderRadius: 10, border: '1px solid rgba(78,205,196,0.2)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--teal)' }}>The AI key is configured as a server secret and is never sent to your browser.</p>
              </div>
            </>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--txt3)' }}>Checking the secure AI connection…</p>
          )}
        </div>

        <button onClick={handleSave} style={{ padding: 13, borderRadius: 12, background: saved ? 'var(--sage)' : 'linear-gradient(135deg, var(--teal-dim), var(--teal))', border: 'none', color: '#0a1918', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'inherit' }}>
          {saved ? '✓ Settings Saved!' : 'Save Settings'}
        </button>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--txt)' }}>🚪 Sign Out</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--txt3)', marginBottom: 14 }}>Your mood data stays saved on this device. You can sign back in anytime.</p>
          {!confirmLogout ? (
            <button onClick={() => setConfirmLogout(true)} style={{ padding: '10px 20px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', background: 'var(--surface2)', border: '1.5px solid var(--border)', color: 'var(--txt2)', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
              Sign Out of MindBridge+
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: '0.83rem', color: 'var(--txt2)' }}>Are you sure?</span>
              <button onClick={onLogout} style={{ padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(255,107,107,0.12)', border: '1.5px solid rgba(255,107,107,0.35)', color: 'var(--crimson)', fontWeight: 700, fontSize: '0.83rem' }}>Yes, Sign Out</button>
              <button onClick={() => setConfirmLogout(false)} className="btn-ghost" style={{ padding: '8px 16px' }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
