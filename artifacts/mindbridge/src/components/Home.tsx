import { useState, useEffect } from 'react';
import { getMoods, getMoodStats, getMoodsAsync, getMoodStatsAsync } from '../lib/storage';

const emotionEmoji: Record<string, string> = {
  happy: '😊', calm: '😌', excited: '🤩', neutral: '😐',
  sad: '😢', anxious: '😰', stressed: '😤', frustrated: '😠',
  distressed: '😫', tired: '😴', loved: '🤗', worried: '😟',
};

const moodGradients: Record<string, string> = {
  happy: 'linear-gradient(135deg, rgba(78,205,196,0.15), rgba(168,230,207,0.1))',
  calm: 'linear-gradient(135deg, rgba(168,230,207,0.15), rgba(78,205,196,0.08))',
  excited: 'linear-gradient(135deg, rgba(247,197,159,0.18), rgba(78,205,196,0.08))',
  sad: 'linear-gradient(135deg, rgba(127,168,255,0.15), rgba(78,205,196,0.06))',
  anxious: 'linear-gradient(135deg, rgba(255,179,71,0.12), rgba(247,197,159,0.08))',
  stressed: 'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(255,179,71,0.06))',
  neutral: 'linear-gradient(135deg, rgba(127,184,181,0.12), rgba(78,205,196,0.06))',
};

export default function Home({ setCurrentPage, user }: any) {
  const [moods, setMoods] = useState<any[]>(() => getMoods());
  const [stats, setStats] = useState<any>(() => getMoodStats());

  useEffect(() => {
    getMoodsAsync().then(m => setMoods(m));
    getMoodStatsAsync().then(s => { if (s) setStats(s); });
  }, []);

  const recent = moods.slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingEmoji = hour < 12 ? '☀️' : hour < 17 ? '🌤️' : '🌙';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ borderRadius: 22, padding: '28px 32px', background: 'linear-gradient(135deg, rgba(78,205,196,0.12) 0%, rgba(168,230,207,0.07) 50%, rgba(247,197,159,0.06) 100%)', border: '1px solid rgba(78,205,196,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{greetingEmoji} Daily Check-in</div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, background: 'linear-gradient(135deg, var(--txt) 0%, var(--teal-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 10 }}>
            {greeting}, {user?.name || 'Friend'}!
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--txt2)', marginBottom: 20, lineHeight: 1.6 }}>
            {stats?.total
              ? `You've logged ${stats.total} mood${stats.total > 1 ? 's' : ''}. ${stats.dominantEmotion ? `Lately feeling ${emotionEmoji[stats.dominantEmotion] || '😊'} ${stats.dominantEmotion} most.` : ''}`
              : 'Ready to begin your mental wellness journey? Start by logging how you feel.'}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setCurrentPage('mood')}>✨ Log My Mood</button>
            <button className="btn-ghost" onClick={() => setCurrentPage('chat')}>💬 Talk to AI</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: '📊', label: 'Mood Logs', value: stats?.total || 0, accent: 'teal', page: 'dashboard' },
          { icon: '🔥', label: 'Day Streak', value: user?.streak || 0, accent: 'sand', page: null },
          { icon: '🌿', label: 'Wellness', value: stats?.total ? `${Math.min(10, Math.max(1, Math.round(5 + (stats.avgIntensity > 5 ? -(stats.avgIntensity - 5) * 0.5 : (5 - stats.avgIntensity) * 0.5))))}/10` : '—', accent: 'sage', page: 'dashboard' },
          { icon: '💬', label: 'Sessions', value: moods.length ? Math.max(1, Math.ceil(moods.length / 2)) : 0, accent: 'lavender', page: 'chat' },
        ].map(({ icon, label, value, accent, page }: any) => (
          <div key={label} className={`card stat-accent-${accent} ${page ? 'card-interactive' : ''}`} onClick={() => page && setCurrentPage(page)} style={{ padding: '18px 20px', paddingLeft: 17 }}>
            <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: `var(--${accent === 'teal' ? 'teal' : accent === 'sage' ? 'sage' : accent === 'sand' ? 'sand' : 'lavender'})` }}>{value}</div>
            <div style={{ fontSize: '0.73rem', color: 'var(--txt3)', marginTop: 3, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
        <div>
          <div className="section-title">Recent Mood Logs</div>
          {recent.length === 0 ? (
            <div className="card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
              <div style={{ color: 'var(--txt3)', fontSize: '0.88rem', marginBottom: 14 }}>No mood logs yet. Express how you feel!</div>
              <button className="btn-primary" onClick={() => setCurrentPage('mood')}>Log Now</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map((mood: any, i: number) => (
                <div key={mood.id} className="card" style={{ padding: '14px 18px', background: moodGradients[mood.emotion] || moodGradients.neutral, animationDelay: `${i * 0.07}s`, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'rgba(78,205,196,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{emotionEmoji[mood.emotion] || '😐'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--txt)', marginBottom: 2 }}>
                      {mood.emotion?.charAt(0).toUpperCase() + mood.emotion?.slice(1)}
                      <span style={{ marginLeft: 6, fontSize: '0.72rem', fontWeight: 500, color: 'var(--txt3)' }}>· {mood.intensity}/10</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--txt3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mood.text || mood.summary || 'No description'}</div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--txt3)', flexShrink: 0 }}>{new Date(mood.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="section-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { emoji: '🎤', label: 'Voice Mood Log', sub: 'Speak your feelings', page: 'mood', grad: 'rgba(78,205,196,0.1)', border: 'rgba(78,205,196,0.2)' },
              { emoji: '🧘', label: 'Calm Down', sub: 'Breathing exercise', page: 'activities', grad: 'rgba(168,230,207,0.1)', border: 'rgba(168,230,207,0.2)' },
              { emoji: '📊', label: 'View Trends', sub: 'Weekly mood chart', page: 'dashboard', grad: 'rgba(247,197,159,0.08)', border: 'rgba(247,197,159,0.2)' },
              { emoji: '🚨', label: 'Crisis Help', sub: 'Immediate support', page: 'crisis', grad: 'rgba(255,107,107,0.07)', border: 'rgba(255,107,107,0.2)' },
            ].map(({ emoji, label, sub, page, grad, border }: any) => (
              <button key={label} onClick={() => setCurrentPage(page)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderRadius: 14, background: grad, border: `1px solid ${border}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%', fontFamily: 'inherit' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
                <div>
                  <div style={{ fontSize: '0.87rem', fontWeight: 700, color: 'var(--txt)' }}>{label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--txt3)' }}>{sub}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--txt3)', fontSize: '0.8rem' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
