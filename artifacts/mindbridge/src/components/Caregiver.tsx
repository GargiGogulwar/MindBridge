import { getMoods, getMoodStats } from '../lib/storage';

const EMOTION_EMOJIS: Record<string, string> = {
  happy: '😊', calm: '😌', excited: '🤩', neutral: '😐',
  sad: '😢', anxious: '😰', stressed: '😤', frustrated: '😠',
  distressed: '😫', tired: '😴',
};

const RISK_CONFIG: Record<string, any> = {
  none: { color: 'var(--sage)', bg: 'rgba(168,230,207,0.12)', label: 'No Risk' },
  low: { color: 'var(--sand)', bg: 'rgba(247,197,159,0.12)', label: 'Low Risk' },
  medium: { color: '#ffb347', bg: 'rgba(255,179,71,0.12)', label: 'Medium Risk' },
  high: { color: 'var(--crimson)', bg: 'rgba(255,107,107,0.12)', label: 'High Risk' },
};

export default function Caregiver() {
  const moods = getMoods();
  const stats = getMoodStats();

  const highRisk = moods.filter((m: any) => m.crisisRisk === 'high');
  const mediumRisk = moods.filter((m: any) => m.crisisRisk === 'medium');
  const recentMoods = moods.slice(0, 10);

  const overallRisk = highRisk.length > 0 ? 'high' : mediumRisk.length > 0 ? 'medium' : 'none';
  const riskCfg = RISK_CONFIG[overallRisk];

  return (
    <div>
      <div style={{ background: overallRisk === 'high' ? 'rgba(255,107,107,0.08)' : 'rgba(78,205,196,0.06)', border: `1px solid ${riskCfg.color}44`, borderRadius: 20, padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ fontSize: 44 }}>{overallRisk === 'high' ? '🚨' : overallRisk === 'medium' ? '⚠️' : '✅'}</div>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 4, color: riskCfg.color }}>Overall Status: {riskCfg.label}</h2>
          <p style={{ color: 'var(--txt2)', fontSize: '0.88rem' }}>
            {overallRisk === 'high'
              ? `⚠️ ${highRisk.length} high-risk mood log(s) detected. Immediate attention recommended.`
              : overallRisk === 'medium'
                ? `${mediumRisk.length} medium-risk log(s) detected. Monitor closely.`
                : stats?.total
                  ? 'No crisis signals detected. Mood patterns appear stable.'
                  : 'No mood data yet. Encourage the user to log their mood daily.'}
          </p>
        </div>
      </div>

      {highRisk.length > 0 && (
        <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <h3 style={{ color: 'var(--crimson)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            🚨 High Risk Alerts ({highRisk.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {highRisk.slice(0, 5).map((mood: any) => (
              <div key={mood.id} style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{EMOTION_EMOJIS[mood.emotion] || '😫'}</span>
                  <span style={{ fontWeight: 600, color: 'var(--crimson)' }}>{mood.emotion?.charAt(0).toUpperCase() + mood.emotion?.slice(1)}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--txt3)' }}>{new Date(mood.timestamp).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--txt2)' }}>{mood.text || mood.summary}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: 14, background: 'rgba(255,107,107,0.06)', borderRadius: 10 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--txt2)', fontWeight: 600, marginBottom: 8 }}>Recommended Actions:</p>
            <ul style={{ paddingLeft: 16, color: 'var(--txt2)', fontSize: '0.82rem', lineHeight: 1.7 }}>
              <li>Check in with the person directly and ask how they are feeling</li>
              <li>Contact a mental health professional or therapist</li>
              <li>Share crisis resources: Call/Text 988, Text HOME to 741741</li>
              <li>Create a safety plan together if needed</li>
            </ul>
          </div>
        </div>
      )}

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { emoji: '📊', label: 'Total Logs', value: stats.total, color: 'var(--teal)' },
            { emoji: '📈', label: 'Avg Intensity', value: `${stats.avgIntensity}/10`, color: 'var(--sand)' },
            { emoji: '🚨', label: 'High Risk', value: highRisk.length, color: 'var(--crimson)' },
            { emoji: '⚠️', label: 'Medium Risk', value: mediumRisk.length, color: '#ffb347' },
          ].map(({ emoji, label, value, color }) => (
            <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--txt3)', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Recent Mood History</h3>
        {recentMoods.length === 0 ? (
          <p style={{ color: 'var(--txt3)', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>No mood logs yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentMoods.map((mood: any) => {
              const risk = RISK_CONFIG[mood.crisisRisk || 'none'];
              return (
                <div key={mood.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--surface2)', borderRadius: 10 }}>
                  <div style={{ fontSize: 22 }}>{EMOTION_EMOJIS[mood.emotion] || '😐'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--txt)' }}>{mood.emotion?.charAt(0).toUpperCase() + mood.emotion?.slice(1)}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--txt3)' }}>Intensity: {mood.intensity}/10</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--txt3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mood.text || mood.summary || '—'}</div>
                  </div>
                  <div style={{ flexShrink: 0, padding: '3px 9px', borderRadius: 20, background: risk.bg, color: risk.color, fontSize: '0.68rem', fontWeight: 700 }}>{risk.label}</div>
                  <div style={{ flexShrink: 0, fontSize: '0.7rem', color: 'var(--txt3)' }}>{new Date(mood.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
        <h3 style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>📚 Caregiver Resources</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[
            { emoji: '📞', title: '988 Crisis Lifeline', desc: 'Call or text 988 for immediate crisis support', color: 'var(--crimson)' },
            { emoji: '💬', title: 'Crisis Text Line', desc: 'Text HOME to 741741 for text-based support', color: 'var(--teal)' },
            { emoji: '🧠', title: 'NAMI Helpline', desc: '1-800-950-NAMI — mental health information & support', color: 'var(--sand)' },
            { emoji: '🤝', title: 'SAMHSA Helpline', desc: '1-800-662-4357 — substance abuse & mental health', color: 'var(--sage)' },
          ].map(({ emoji, title, desc, color }) => (
            <div key={title} style={{ padding: 14, background: 'var(--surface2)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</div>
              <div style={{ fontWeight: 700, color, fontSize: '0.88rem', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--txt3)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
