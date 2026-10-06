export default function Crisis({ setCurrentPage }: any) {
  return (
    <div>
      <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 20, padding: 28, marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🚨</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--crimson)' }}>You Are Not Alone</h2>
        <p style={{ color: 'var(--txt2)', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto' }}>
          If you are in crisis or having thoughts of harming yourself, please reach out immediately. Help is available 24/7.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { emoji: '📞', label: 'Crisis Lifeline', number: '988', sub: 'Call or Text · US Only', color: 'var(--crimson)', bg: 'rgba(255,107,107,0.08)', href: 'tel:988' },
          { emoji: '💬', label: 'Crisis Text Line', number: 'Text HOME to 741741', sub: 'Available 24/7', color: 'var(--teal)', bg: 'rgba(78,205,196,0.08)', href: 'sms:741741' },
          { emoji: '🌍', label: 'International', number: 'findahelpline.com', sub: 'Global crisis resources', color: 'var(--sand)', bg: 'rgba(247,197,159,0.08)', href: 'https://findahelpline.com' },
        ].map(({ emoji, label, number, sub, color, bg, href }) => (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ padding: 22, background: bg, border: `1px solid ${color}44`, borderRadius: 16, textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color, marginBottom: 4 }}>{label}</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--txt)', marginBottom: 4 }}>{number}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt3)' }}>{sub}</div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 22, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>🌿 Grounding Technique — Try This Now</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--txt2)', marginBottom: 14 }}>The 5-4-3-2-1 technique can help bring you back to the present moment:</p>
        {[
          { n: 5, sense: 'SEE', prompt: 'Name 5 things you can see right now' },
          { n: 4, sense: 'TOUCH', prompt: 'Touch 4 surfaces and notice their texture' },
          { n: 3, sense: 'HEAR', prompt: 'Listen for 3 sounds around you' },
          { n: 2, sense: 'SMELL', prompt: 'Find 2 things you can smell (or imagine calm scents)' },
          { n: 1, sense: 'TASTE', prompt: 'Notice 1 thing you can taste' },
        ].map(({ n, sense, prompt }) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(78,205,196,0.15)', border: '1px solid rgba(78,205,196,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--teal)', flexShrink: 0 }}>{n}</div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--teal)', fontSize: '0.8rem' }}>{sense}: </span>
              <span style={{ color: 'var(--txt2)', fontSize: '0.88rem' }}>{prompt}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 22 }}>
        <h3 style={{ fontWeight: 700, color: 'var(--txt)', marginBottom: 14 }}>💙 Remember</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'You are not alone — millions of people face mental health challenges',
            'This feeling is temporary — it will pass with support',
            'Reaching out for help is a sign of strength, not weakness',
            'You matter to the people around you',
            'Recovery is possible — many people get through this and thrive',
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '1rem', marginTop: 2 }}>✓</span>
              <span style={{ color: 'var(--txt2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setCurrentPage('chat')} style={{ width: '100%', padding: 14, borderRadius: 14, background: 'linear-gradient(135deg, var(--teal-dim), var(--teal))', border: 'none', color: '#0a1918', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
          💬 Talk to AI Companion Now
        </button>
      </div>
    </div>
  );
}
