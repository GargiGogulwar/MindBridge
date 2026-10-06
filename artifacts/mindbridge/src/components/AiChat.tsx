import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, RefreshCw, X, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { chatWithAI, getFunnyCheer } from '../lib/groq';
import { useAiStatus } from '../hooks/useAiStatus';
import { useSpeech } from '../hooks/useSpeech';
import { useVoiceOver } from '../hooks/useVoiceOver';

const QUICK_PROMPTS = [
  "I'm feeling anxious today",
  "I need help calming down",
  "I'm feeling really sad",
  "I can't sleep",
  "I'm stressed about school",
  "I feel overwhelmed",
];

const CHEER_ANIMALS = ['🐶', '🐱', '🐼', '🦊', '🐨', '🐸', '🦁', '🐧', '🦋', '🌸', '🌈', '⭐', '🎉', '🎊', '✨'];
const CHEER_ACTIVITIES = [
  { emoji: '🌬️', label: 'Breathe with me', action: 'breath' },
  { emoji: '🎵', label: 'Mood boost playlist', action: 'music' },
  { emoji: '😂', label: 'Another joke!', action: 'joke' },
];

function CheerOverlay({ onClose, onActivity }: { onClose: () => void; onActivity: (a: string) => void }) {
  const [joke, setJoke] = useState('');
  const [loadingJoke, setLoadingJoke] = useState(true);
  const [floaters, setFloaters] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([]);

  useEffect(() => {
    setFloaters(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: CHEER_ANIMALS[Math.floor(Math.random() * CHEER_ANIMALS.length)],
        x: Math.random() * 90 + 5,
        delay: Math.random() * 3,
      }))
    );
    getFunnyCheer().then(j => { setJoke(j); setLoadingJoke(false); }).catch(() => {
      setJoke("Why did the dog sit in the shade? Because it didn't want to be a hot dog! Sending you warmth and a smile today.");
      setLoadingJoke(false);
    });
  }, []);

  const refreshJoke = () => {
    setLoadingJoke(true);
    getFunnyCheer().then(j => { setJoke(j); setLoadingJoke(false); }).catch(() => {
      setJoke("You are doing amazing simply by being here. Give yourself a huge virtual hug right now — you deserve it!");
      setLoadingJoke(false);
    });
  };

  return (
    <div className="cheer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Floating emoji rain */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {floaters.map(f => (
          <div key={f.id} style={{
            position: 'absolute', bottom: '-10%', left: `${f.x}%`, fontSize: '2rem',
            animation: `cheerFloat ${3 + f.delay}s ease-in ${f.delay}s infinite`,
          }}>{f.emoji}</div>
        ))}
      </div>

      {/* Main card */}
      <div className="cheer-pop" style={{
        position: 'relative', zIndex: 1,
        background: 'linear-gradient(135deg, rgba(22,40,37,0.97), rgba(30,53,50,0.97))',
        border: '1.5px solid rgba(78,205,196,0.4)',
        borderRadius: 28, padding: '36px 32px',
        maxWidth: 480, width: '90%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(78,205,196,0.12)',
        backdropFilter: 'blur(24px)',
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--txt3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12, animation: 'cheerBounce 1s ease-in-out infinite' }}>
            {CHEER_ANIMALS[Math.floor(Math.random() * 5)]}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.25)', marginBottom: 10 }}>
            <Sparkles size={12} style={{ color: 'var(--teal)' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cheer Mode Activated</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
            You matter so much! <span style={{ animation: 'rainbow 2s linear infinite', display: 'inline-block' }}>✨</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--txt2)', lineHeight: 1.6 }}>
            Feeling low is real, and it is okay. We brought something to help lift your mood right now.
          </p>
        </div>

        {/* Joke card */}
        <div style={{ background: 'rgba(78,205,196,0.06)', border: '1px solid rgba(78,205,196,0.18)', borderRadius: 18, padding: '20px 22px', marginBottom: 20, minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {loadingJoke ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          ) : (
            <p style={{ fontSize: '0.92rem', color: 'var(--txt)', lineHeight: 1.7, textAlign: 'center', fontStyle: 'italic' }}>
              {joke}
            </p>
          )}
        </div>

        {/* Bouncing critters row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 22 }}>
          {CHEER_ANIMALS.slice(0, 6).map((a, i) => (
            <span key={i} style={{ fontSize: '1.6rem', display: 'inline-block', animation: `cheerBounce ${0.8 + i * 0.12}s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}>{a}</span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          <button onClick={refreshJoke} style={{ padding: '10px 8px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--txt2)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}>
            <span style={{ fontSize: '1.2rem' }}>😂</span>Another joke
          </button>
          <button onClick={() => onActivity('breath')} style={{ padding: '10px 8px', borderRadius: 12, border: '1px solid rgba(78,205,196,0.3)', background: 'rgba(78,205,196,0.08)', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--teal)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}>
            <span style={{ fontSize: '1.2rem' }}>🌬️</span>Breathe
          </button>
          <button onClick={() => onActivity('dance')} style={{ padding: '10px 8px', borderRadius: 12, border: '1px solid rgba(168,230,207,0.3)', background: 'rgba(168,230,207,0.06)', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--sage)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}>
            <span style={{ fontSize: '1.2rem' }}>💃</span>Dance break
          </button>
        </div>

        {/* Affirmation */}
        <div style={{ textAlign: 'center', padding: '12px 16px', borderRadius: 14, background: 'linear-gradient(135deg, rgba(247,197,159,0.08), rgba(78,205,196,0.06))', border: '1px solid rgba(247,197,159,0.2)' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--sand)', fontWeight: 600, lineHeight: 1.6 }}>
            "This feeling is temporary. You have survived every difficult moment so far — and you will survive this one too."
          </p>
        </div>

        <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
          Back to Chat
        </button>
      </div>
    </div>
  );
}

function DanceBreakOverlay({ onClose }: { onClose: () => void }) {
  const moves = ['💃', '🕺', '🌟', '✨', '🎉', '🎊', '🥳', '🌈'];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f + 1) % moves.length), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="cheer-overlay" onClick={onClose}>
      <div className="cheer-pop" style={{ textAlign: 'center', padding: 48, position: 'relative', zIndex: 1, background: 'rgba(22,40,37,0.97)', border: '1.5px solid rgba(78,205,196,0.4)', borderRadius: 28, maxWidth: 380, width: '90%' }}>
        <div style={{ fontSize: '5rem', marginBottom: 16, display: 'inline-block', animation: 'cheerBounce 0.4s ease-in-out infinite' }}>{moves[frame]}</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Dance Break!</h2>
        <p style={{ color: 'var(--txt2)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.6 }}>
          Move your body for 30 seconds! Shake your hands, bounce in your seat, wiggle — anything goes. Your brain releases happy chemicals when you move!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {moves.map((m, i) => (
            <span key={i} style={{ fontSize: '1.8rem', display: 'inline-block', animation: `cheerBounce ${0.5 + i * 0.08}s ease-in-out infinite`, animationDelay: `${i * 0.06}s` }}>{m}</span>
          ))}
        </div>
        <button className="btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>I feel better!</button>
      </div>
    </div>
  );
}

function BreathingMini({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const durations: Record<string, number> = { inhale: 4, hold: 4, exhale: 4 };
    let c = count;
    const t = setInterval(() => {
      c -= 1;
      setCount(c);
      if (c <= 0) {
        if (phase === 'inhale') { setPhase('hold'); setCount(4); }
        else if (phase === 'hold') { setPhase('exhale'); setCount(4); }
        else { setPhase('inhale'); setCount(4); setCycles(prev => prev + 1); }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  if (cycles >= 3) {
    return (
      <div className="cheer-overlay" onClick={onClose}>
        <div className="cheer-pop" style={{ textAlign: 'center', padding: 48, background: 'rgba(22,40,37,0.97)', border: '1.5px solid rgba(78,205,196,0.4)', borderRadius: 28, maxWidth: 360, width: '90%', zIndex: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌟</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>Beautifully done!</h2>
          <p style={{ color: 'var(--txt2)', marginBottom: 24 }}>3 full breath cycles complete. Notice how your body feels a little calmer now.</p>
          <button className="btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Back to Chat</button>
        </div>
      </div>
    );
  }

  const labels: Record<string, string> = { inhale: 'Breathe In', hold: 'Hold', exhale: 'Breathe Out' };
  const scale = phase === 'inhale' ? 1.6 : phase === 'hold' ? 1.6 : 1;

  return (
    <div className="cheer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cheer-pop" style={{ textAlign: 'center', padding: '40px 36px', background: 'rgba(22,40,37,0.97)', border: '1.5px solid rgba(78,205,196,0.4)', borderRadius: 28, maxWidth: 360, width: '90%', zIndex: 1 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 6 }}>Quick Breath Reset</h2>
        <p style={{ color: 'var(--txt3)', fontSize: '0.8rem', marginBottom: 28 }}>3 cycles of box breathing to calm your nervous system</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', border: '2.5px solid rgba(78,205,196,0.35)', background: 'radial-gradient(circle, rgba(78,205,196,0.2), rgba(78,205,196,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `scale(${scale})`, transition: 'transform 1s ease-in-out' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--teal)' }}>{count}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--txt2)', marginTop: 4 }}>{labels[phase]}</span>
          </div>
        </div>
        <p style={{ color: 'var(--txt3)', fontSize: '0.78rem', marginBottom: 20 }}>Cycle {cycles + 1} of 3</p>
        <button className="btn-muted" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Exit early</button>
      </div>
    </div>
  );
}

export default function AiChat() {
  const aiAvailable = useAiStatus();
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello! I'm your MindBridge AI companion. 💙 I'm here to listen, support, and care — anytime, without judgment. How are you feeling today?",
    timestamp: new Date().toISOString(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cheerMode, setCheerMode] = useState<null | 'cheer' | 'dance' | 'breath'>(null);
  const [voiceReply, setVoiceReply] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleVoiceResult = useCallback((t: string) => setInput(prev => prev ? `${prev} ${t}` : t), []);
  const { isListening, isSupported, toggle } = useSpeech({ onResult: handleVoiceResult });
  const { speak, stop, isSupported: ttsSupported } = useVoiceOver();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    stop();
    const userMsg = { role: 'user', content: msg, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let openCheerAfterReply = false;

    try {
      const { response, sadnessDetected, crisisDetected } = await chatWithAI(messages, msg);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date().toISOString() }]);
      if (voiceReply && ttsSupported) {
        const clean = response.replace(/[*_~`#]/g, '').replace(/\s+/g, ' ').trim();
        speak(clean, { rate: 0.85, pitch: 1.05 });
      }
      openCheerAfterReply = sadnessDetected && !crisisDetected;
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble responding right now. If you need immediate help, please call 988. 💙",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }

    if (openCheerAfterReply) {
      window.setTimeout(() => setCheerMode('cheer'), 350);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    stop();
    setMessages([{
      role: 'assistant',
      content: "Fresh start! 💙 I'm here and listening. What's on your mind?",
      timestamp: new Date().toISOString(),
    }]);
  };

  const toggleVoiceReply = () => {
    if (voiceReply) stop();
    setVoiceReply(v => !v);
  };

  const timeFormat = (ts: string) => new Date(ts).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  const handleCheerActivity = (action: string) => {
    setCheerMode(action as any);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 190px)', minHeight: 520 }}>

      {/* Cheer overlays */}
      {cheerMode === 'cheer' && (
        <CheerOverlay onClose={() => setCheerMode(null)} onActivity={handleCheerActivity} />
      )}
      {cheerMode === 'dance' && <DanceBreakOverlay onClose={() => setCheerMode(null)} />}
      {cheerMode === 'breath' && <BreathingMini onClose={() => setCheerMode(null)} />}

      {/* Top bar — AI status + voice toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        {aiAvailable === false ? (
          <div style={{ borderRadius: 12, padding: '8px 14px', background: 'rgba(247,197,159,0.07)', border: '1px solid rgba(247,197,159,0.2)', fontSize: '0.78rem', color: 'var(--sand)', flex: 1 }}>
            💡 Offline replies are active — the AI service is unavailable right now
          </div>
        ) : (
          <div style={{ fontSize: '0.78rem', color: 'var(--txt3)' }}>🤖 AI Companion · Powered by Groq</div>
        )}
        {ttsSupported && (
          <button
            onClick={toggleVoiceReply}
            title={voiceReply ? 'Mute AI voice — click to silence' : 'Unmute AI voice — click to hear replies'}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${voiceReply ? 'rgba(78,205,196,0.45)' : 'var(--border)'}`, background: voiceReply ? 'rgba(78,205,196,0.1)' : 'var(--surface2)', color: voiceReply ? 'var(--teal)' : 'var(--txt3)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.2s', flexShrink: 0 }}
          >
            {voiceReply ? <Volume2 size={13} /> : <VolumeX size={13} />}
            {voiceReply ? 'Voice On' : 'Voice Off'}
          </button>
        )}
      </div>

      {/* Quick prompts */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => sendMessage(p)} disabled={loading} style={{ padding: '5px 13px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 600, background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)', color: 'var(--teal)', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px', background: 'var(--card-bg)', borderRadius: 18, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 12, backdropFilter: 'blur(12px)' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--teal-dim), var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: '0 2px 10px rgba(78,205,196,0.25)' }}>🧠</div>
            )}
            <div style={{ maxWidth: '72%' }}>
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ padding: '12px 16px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {msg.content}
              </div>
              <div style={{ fontSize: '0.63rem', color: 'var(--txt3)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left', display: 'flex', alignItems: 'center', gap: 6, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {timeFormat(msg.timestamp)}
                {msg.role === 'assistant' && ttsSupported && (
                  <button
                    onClick={() => speak(msg.content.replace(/[*_~`#]/g, '').trim(), { rate: 0.85, pitch: 1.05 })}
                    title="Read aloud"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--txt3)', cursor: 'pointer', fontSize: '0.62rem', fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.15s' }}
                  >
                    <Volume2 size={9} /> Read
                  </button>
                )}
              </div>
            </div>
            {msg.role === 'user' && (
              <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>😊</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--teal-dim), var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🧠</div>
            <div className="chat-bubble-ai" style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {isSupported && (
          <button onClick={toggle} className={isListening ? 'voice-active' : ''} title={isListening ? 'Stop recording' : 'Voice input'} style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: isListening ? 'rgba(255,107,107,0.12)' : 'var(--surface2)', border: `1.5px solid ${isListening ? 'rgba(255,107,107,0.45)' : 'var(--border)'}`, color: isListening ? 'var(--crimson)' : 'var(--txt2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            {isListening ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
        )}
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={isListening ? '🎤 Listening… speak now' : 'Type or speak your message… (Enter to send)'} rows={1} className="input-field" style={{ paddingRight: 14, resize: 'none', lineHeight: 1.55, maxHeight: 110 }} onFocus={e => e.currentTarget.style.borderColor = 'var(--teal)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
        </div>
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn-primary" style={{ height: 46, padding: '0 16px', opacity: !input.trim() || loading ? 0.55 : 1, cursor: !input.trim() || loading ? 'not-allowed' : 'pointer' }}>
          <Send size={16} />
        </button>
        <button onClick={clearChat} title="Clear chat" style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: 'var(--surface2)', border: '1.5px solid var(--border)', color: 'var(--txt3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {isListening && (
        <div style={{ marginTop: 8, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,107,107,0.07)', border: '1px solid rgba(255,107,107,0.2)', fontSize: '0.8rem', color: 'var(--crimson)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--crimson)', display: 'inline-block', animation: 'pulseGlow 1.2s infinite' }} />
          Recording — speak clearly, then press the mic button to stop
        </div>
      )}
    </div>
  );
}
