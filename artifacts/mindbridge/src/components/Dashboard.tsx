import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { getMoods, getMoodStats, getMoodsAsync, getMoodStatsAsync } from '../lib/storage';

const EMOTION_COLORS: Record<string, string> = {
  happy: '#4ecdc4', calm: '#a8e6cf', excited: '#f7c59f',
  neutral: '#7fb8b5', sad: '#7fa8ff', anxious: '#ffb347',
  stressed: '#ff6b6b', frustrated: '#ff8c00', distressed: '#ff4444', tired: '#9ca3af',
};

const EMOTION_EMOJIS: Record<string, string> = {
  happy: '😊', calm: '😌', excited: '🤩', neutral: '😐',
  sad: '😢', anxious: '😰', stressed: '😤', frustrated: '😠',
  distressed: '😫', tired: '😴', loved: '🤗', worried: '😟',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1c3735', border: '1px solid rgba(78,205,196,0.2)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: 'var(--txt3)', fontSize: '0.78rem', marginBottom: 4 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || 'var(--teal)', fontSize: '0.88rem', fontWeight: 600 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ setCurrentPage }: any) {
  const [moods, setMoods] = useState<any[]>(() => getMoods());
  const [stats, setStats] = useState<any>(() => getMoodStats());

  useEffect(() => {
    getMoodsAsync().then(m => { setMoods(m); });
    getMoodStatsAsync().then(s => { if (s) setStats(s); });
  }, []);

  if (!moods.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>No Data Yet</h2>
        <p style={{ color: 'var(--txt3)', fontSize: '0.9rem', marginBottom: 20 }}>Log your first mood to see beautiful visualizations here!</p>
        <button onClick={() => setCurrentPage('mood')} style={{ padding: '12px 24px', borderRadius: 12, background: 'var(--teal)', border: 'none', color: '#0a1918', fontWeight: 700, cursor: 'pointer' }}>Log My First Mood</button>
      </div>
    );
  }

  const emotionData = Object.entries(stats!.emotionCounts).map(([name, value]) => ({ name, value }));
  const sentimentCounts = moods.reduce((acc: any, m: any) => { acc[m.sentiment || 'neutral'] = (acc[m.sentiment || 'neutral'] || 0) + 1; return acc; }, {});
  const sentimentData = [
    { name: 'Positive', value: sentimentCounts.positive || 0, color: '#4ecdc4' },
    { name: 'Neutral', value: sentimentCounts.neutral || 0, color: '#7fb8b5' },
    { name: 'Negative', value: sentimentCounts.negative || 0, color: '#ff6b6b' },
  ].filter(d => d.value > 0);
  const intensityTrend = stats!.dailyData.map((d: any) => ({ ...d, intensity: d.intensity || 0 }));

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { emoji: '📊', label: 'Total Logs', value: stats!.total, color: 'var(--teal)' },
          { emoji: EMOTION_EMOJIS[stats!.dominantEmotion] || '😊', label: 'Top Mood', value: stats!.dominantEmotion?.charAt(0).toUpperCase() + stats!.dominantEmotion?.slice(1) || 'N/A', color: EMOTION_COLORS[stats!.dominantEmotion] || 'var(--teal)' },
          { emoji: '📈', label: 'Avg Intensity', value: `${stats!.avgIntensity}/10`, color: 'var(--sand)' },
          { emoji: '📅', label: 'This Week', value: `${stats!.dailyData.filter((d: any) => d.count > 0).length} days`, color: 'var(--sage)' },
        ].map(({ emoji, label, value, color }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--txt3)', marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Mood Intensity — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={intensityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(78,205,196,0.08)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--txt3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: 'var(--txt3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="intensity" name="Intensity" stroke="var(--teal)" strokeWidth={2.5} dot={{ fill: 'var(--teal)', r: 4 }} activeDot={{ r: 6 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {sentimentData.map((_entry, i) => <Cell key={i} fill={sentimentData[i].color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            {sentimentData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--txt3)' }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Emotion Frequency</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(78,205,196,0.08)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--txt3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--txt3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Times" radius={[4, 4, 0, 0]}>
              {emotionData.map((entry, i) => <Cell key={i} fill={EMOTION_COLORS[entry.name] || 'var(--teal)'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
        <h3 style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Recent Mood Timeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {moods.slice(0, 8).map((mood: any) => (
            <div key={mood.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flexShrink: 0, width: 80, fontSize: '0.7rem', color: 'var(--txt3)', textAlign: 'right' }}>
                {new Date(mood.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}<br />
                {new Date(mood.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: (EMOTION_COLORS[mood.emotion] || '#4ecdc4') + '22', border: `2px solid ${EMOTION_COLORS[mood.emotion] || '#4ecdc4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {EMOTION_EMOJIS[mood.emotion] || '😐'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: EMOTION_COLORS[mood.emotion] || 'var(--teal)' }}>{mood.emotion?.charAt(0).toUpperCase() + mood.emotion?.slice(1)}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--txt3)' }}>· Intensity {mood.intensity}/10</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--txt3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mood.text || mood.summary || 'No description'}</div>
              </div>
              <div style={{ flexShrink: 0, padding: '2px 8px', borderRadius: 20, background: mood.crisisRisk === 'high' ? 'rgba(255,107,107,0.15)' : mood.crisisRisk === 'medium' ? 'rgba(255,179,71,0.15)' : 'rgba(168,230,207,0.15)', color: mood.crisisRisk === 'high' ? 'var(--crimson)' : mood.crisisRisk === 'medium' ? '#ffb347' : 'var(--sage)', fontSize: '0.65rem', fontWeight: 600 }}>
                {mood.crisisRisk || 'none'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
