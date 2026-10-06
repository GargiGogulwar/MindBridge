import { useState, useCallback } from 'react';
import { Mic, MicOff, Send, RotateCcw } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { analyzeEmotion } from '../lib/groq';
import { useAiStatus } from '../hooks/useAiStatus';
import { saveMood, updateStreak } from '../lib/storage';

const MOOD_EMOJIS = [
  { emoji: '😊', label: 'Happy' }, { emoji: '😌', label: 'Calm' }, { emoji: '🤩', label: 'Excited' },
  { emoji: '😐', label: 'Neutral' }, { emoji: '😢', label: 'Sad' }, { emoji: '😰', label: 'Anxious' },
  { emoji: '😤', label: 'Stressed' }, { emoji: '😠', label: 'Frustrated' }, { emoji: '😫', label: 'Overwhelmed' },
  { emoji: '😴', label: 'Tired' }, { emoji: '🤗', label: 'Loved' }, { emoji: '😟', label: 'Worried' },
];

const getCrisisColor = (risk: string) => ({ none: 'var(--sage)', low: 'var(--sand)', medium: '#ffb347', high: 'var(--crimson)' }[risk] || 'var(--sage)');

export default function MoodLogger({ onMoodLogged }: any) {
  const aiAvailable = useAiStatus();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState('input');

  const handleVoiceResult = useCallback((t: string) => setText(prev => prev ? `${prev} ${t}` : t), []);
  const handleVoiceError = useCallback((e: string) => setError(e), []);
  const { isListening, isSupported, toggle } = useSpeech({ onResult: handleVoiceResult, onError: handleVoiceError });

  const toggleEmoji = (emoji: string) =>
    setSelectedEmojis(prev => prev.includes(emoji) ? prev.filter(e => e !== emoji) : [...prev, emoji]);

  const handleSubmit = async () => {
    if (!text.trim() && selectedEmojis.length === 0) { setError('Please select an emoji or write/speak how you feel.'); return; }
    setAnalyzing(true); setError(''); setStep('analyzing');
    try {
      const analysis = await analyzeEmotion(text, selectedEmojis);
      const entry = saveMood({ text, emojis: selectedEmojis, ...analysis });
      updateStreak();
      setResult({ ...analysis, entry });
      setStep('result');
    } catch {
      setError('Analysis failed. Please try again.');
      setStep('input');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => { setSelectedEmojis([]); setText(''); setResult(null); setError(''); setStep('input'); };

  if (step === 'analyzing') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }} className="animate-scale-in">
        <div style={{ fontSize: 60, marginBottom: 18 }}>🧠</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Analyzing your mood…</h2>
        <p style={{ color: 'var(--txt3)', fontSize: '0.9rem' }}>AI is understanding your emotional state</p>
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ borderRadius: 20, padding: '28px 32px', textAlign: 'center', background: result.sentiment === 'positive' ? 'linear-gradient(135deg, rgba(78,205,196,0.12), rgba(168,230,207,0.08))' : result.sentiment === 'negative' ? 'linear-gradient(135deg, rgba(127,168,255,0.1), rgba(78,205,196,0.06))' : 'linear-gradient(135deg, rgba(78,205,196,0.08), rgba(168,230,207,0.05))', border: '1px solid rgba(78,205,196,0.2)' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{result.sentiment === 'positive' ? '🌟' : result.sentiment === 'negative' ? '💙' : '😊'}</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>Mood Logged!</h2>
          <p style={{ color: 'var(--txt2)', fontSize: '0.9rem', maxWidth: 480, margin: '0 auto' }}>{result.summary}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Emotion', value: result.emotion?.charAt(0).toUpperCase() + result.emotion?.slice(1), color: 'var(--teal)' },
            { label: 'Intensity', value: `${result.intensity}/10`, color: 'var(--sand)' },
            { label: 'Sentiment', value: result.sentiment?.charAt(0).toUpperCase() + result.sentiment?.slice(1), color: 'var(--sage)' },
            { label: 'Risk Level', value: result.crisisRisk?.charAt(0).toUpperCase() + result.crisisRisk?.slice(1), color: getCrisisColor(result.crisisRisk) },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: '16px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {result.crisisRisk === 'high' && (
          <div style={{ background: 'rgba(255,107,107,0.1)', border: '1.5px solid rgba(255,107,107,0.3)', borderRadius: 16, padding: 18 }}>
            <div style={{ fontWeight: 800, color: 'var(--crimson)', marginBottom: 8 }}>🚨 Crisis Support Available</div>
            <p style={{ fontSize: '0.87rem', color: 'var(--txt2)', marginBottom: 12 }}>It sounds like you may need immediate support. Please reach out — you are not alone.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href="tel:988" style={{ padding: '9px 18px', borderRadius: 10, background: 'var(--crimson)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>📞 Call 988</a>
              <a href="sms:741741" style={{ padding: '9px 18px', borderRadius: 10, background: 'rgba(255,107,107,0.2)', color: 'var(--crimson)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>💬 Text 741741</a>
            </div>
          </div>
        )}

        {result.suggestions?.length > 0 && (
          <div className="card" style={{ padding: '20px 22px' }}>
            <div className="section-title">Personalized Suggestions for You</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.suggestions.map((s: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: 'rgba(78,205,196,0.15)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--txt2)', lineHeight: 1.55 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-muted" onClick={handleReset} style={{ flex: 1 }}><RotateCcw size={15} /> Log Another</button>
          <button className="btn-primary" onClick={onMoodLogged} style={{ flex: 1, justifyContent: 'center' }}>View Dashboard →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680, margin: '0 auto' }}>
      <div>
        <div className="section-title">How are you feeling right now?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {MOOD_EMOJIS.map(({ emoji, label }) => (
            <button key={emoji} className={`emoji-btn ${selectedEmojis.includes(emoji) ? 'selected' : ''}`} onClick={() => toggleEmoji(emoji)}>
              <div style={{ fontSize: 28, marginBottom: 5 }}>{emoji}</div>
              <div style={{ fontSize: '0.68rem', color: selectedEmojis.includes(emoji) ? 'var(--teal)' : 'var(--txt3)', fontWeight: 600 }}>{label}</div>
            </button>
          ))}
        </div>
        {selectedEmojis.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--txt3)' }}>Selected:</span>
            {selectedEmojis.map(e => <span key={e} style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => toggleEmoji(e)}>{e}</span>)}
          </div>
        )}
      </div>

      {isSupported && (
        <div style={{ borderRadius: 18, padding: '20px 24px', background: isListening ? 'rgba(255,107,107,0.07)' : 'rgba(78,205,196,0.05)', border: `1.5px solid ${isListening ? 'rgba(255,107,107,0.35)' : 'rgba(78,205,196,0.18)'}`, transition: 'all 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isListening ? 12 : 0 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isListening ? 'var(--crimson)' : 'var(--teal)', marginBottom: 2 }}>{isListening ? '🎙️ Listening… speak now' : '🎤 Voice Input'}</div>
              {!isListening && <div style={{ fontSize: '0.75rem', color: 'var(--txt3)' }}>Tap the button and speak your feelings aloud</div>}
            </div>
            <button onClick={toggle} className={isListening ? 'voice-active' : ''} style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0, background: isListening ? 'rgba(255,107,107,0.15)' : 'rgba(78,205,196,0.15)', border: `2px solid ${isListening ? 'rgba(255,107,107,0.5)' : 'rgba(78,205,196,0.4)'}`, color: isListening ? 'var(--crimson)' : 'var(--teal)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: '1.2rem' }}>
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
          {isListening && (
            <div style={{ background: 'rgba(255,107,107,0.06)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', color: 'var(--txt2)', minHeight: 44, fontStyle: 'italic', border: '1px solid rgba(255,107,107,0.15)' }}>
              {text || <span style={{ color: 'var(--txt3)' }}>Your words will appear here…</span>}
            </div>
          )}
        </div>
      )}

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Describe in your own words</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--txt3)' }}>Optional</span>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind? How does your body feel? Even a few words help…" className="input-field" style={{ minHeight: 110, resize: 'vertical', lineHeight: 1.65 }} onFocus={e => e.currentTarget.style.borderColor = 'var(--teal)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
      </div>

      {error && <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 12, padding: '12px 16px', color: 'var(--crimson)', fontSize: '0.85rem' }}>{error}</div>}

      <button className="btn-primary" onClick={handleSubmit} disabled={analyzing} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: analyzing ? 0.7 : 1, cursor: analyzing ? 'not-allowed' : 'pointer' }}>
        <Send size={16} />{analyzing ? 'Analyzing…' : 'Analyze My Mood'}
      </button>

      {aiAvailable === false && (
        <p style={{ textAlign: 'center', fontSize: '0.73rem', color: 'var(--txt3)' }}>
          Using offline mood analysis — the AI service is unavailable right now
        </p>
      )}
    </div>
  );
}
