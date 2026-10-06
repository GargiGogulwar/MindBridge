import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useVoiceOver } from '../hooks/useVoiceOver';

const BREATHING_PATTERNS = [
  { id: 'box', name: 'Box Breathing', emoji: '🔲', color: 'var(--teal)', colorBg: 'rgba(78,205,196,0.12)', description: 'Build calm focus in 4 equal counts', tag: 'Focus', inhale: 4, hold: 4, exhale: 4, holdOut: 4, cycles: 4 },
  { id: '478', name: '4-7-8 Relaxation', emoji: '🌊', color: 'var(--sage)', colorBg: 'rgba(168,230,207,0.12)', description: 'Deep calm — great before sleep', tag: 'Sleep', inhale: 4, hold: 7, exhale: 8, holdOut: 0, cycles: 4 },
  { id: 'belly', name: 'Belly Breathing', emoji: '🌿', color: 'var(--sand)', colorBg: 'rgba(247,197,159,0.12)', description: "Activate your body's calm response", tag: 'Anxiety', inhale: 5, hold: 2, exhale: 6, holdOut: 0, cycles: 5 },
];

const MEDITATIONS = [
  { id: 'body-scan', title: '2-Min Body Scan', emoji: '🧘', duration: '2 min', tag: 'Relax', color: 'var(--sage)', steps: ['Find a comfortable position and gently close your eyes.', 'Take three slow, deep breaths. With every exhale, let your body sink a little deeper.', 'Bring soft attention to your feet and toes. Notice any warmth, tingling, or pressure — just observe.', 'Slowly move your awareness up through your calves, knees, and thighs. There is no need to change anything.', 'Let your belly and lower back soften as you breathe. Feel your chest expand gently with each inhale.', 'Relax your shoulders away from your ears. Let your arms hang heavy. Unclench your hands.', 'Soften your jaw, your eyes, your forehead. Let your face be completely at rest.', 'Rest here for a moment, aware of your whole body breathing together as one.', 'When you are ready, gently wiggle your fingers and open your eyes. Well done!'] },
  { id: 'grounding', title: '5-4-3-2-1 Grounding', emoji: '🌍', duration: '3 min', tag: 'Anxiety', color: 'var(--teal)', steps: ['Take a slow breath in… and let it out. You are safe right here.', '5 — Look around slowly. Name 5 things you can see. Really look at each one.', '4 — Reach out and touch 4 different surfaces near you. Notice if they are warm, cool, rough, or smooth.', '3 — Close your eyes and listen. Name 3 sounds you can hear, even quiet ones.', '2 — Notice 2 things you can smell — fresh air, your clothes, coffee, anything at all.', '1 — Notice 1 taste in your mouth right now.', 'You are grounded. Take one more deep breath and feel yourself anchored to this present moment.'] },
  { id: 'loving-kindness', title: 'Loving-Kindness', emoji: '💙', duration: '4 min', tag: 'Mood', color: 'var(--lavender)', steps: ['Sit comfortably. Place one hand gently over your heart and take a slow breath.', 'Picture yourself, right now in this moment. Smile at yourself — warmly, without judgment.', 'Silently repeat: "May I be happy. May I be safe. May I be peaceful. May I be loved."', 'Now think of someone you love. Hold their face in your mind and send them those same wishes.', '"May you be happy. May you be safe. May you be peaceful. May you be loved."', 'Expand outward — think of people in your neighbourhood, your city, strangers you will never meet.', 'Send kindness to all living beings, in all directions, without limit.', 'Breathe gently and rest in the warmth you have created. Carry this with you today.'] },
];

const AMBIENT_SOUNDS = [
  { id: 'ocean', emoji: '🌊', title: 'Ocean Waves', desc: 'Soft coastal waves', color: 'var(--teal)', videoId: 'V-_O7nl0Ii0' },
  { id: 'night', emoji: '🌙', title: 'Night Crickets', desc: 'Peaceful night ambience', color: 'var(--lavender)', videoId: 'q76bMs-NwRk' },
  { id: 'fire', emoji: '🔥', title: 'Fireplace', desc: 'Warm crackling fire', color: 'var(--sand)', videoId: 'L_LUpnjgPso' },
];

const COPING_TIPS = [
  { emoji: '🚶', tip: '5-min walk in fresh air' }, { emoji: '💧', tip: 'Sip a glass of water slowly' },
  { emoji: '🎵', tip: 'Play a calming song' }, { emoji: '✍️', tip: "Write 3 things you're grateful for" },
  { emoji: '😴', tip: '10-minute power nap' }, { emoji: '🤗', tip: 'Hug someone you trust' },
  { emoji: '🍵', tip: 'Make a warm cup of tea' }, { emoji: '🌱', tip: 'Touch or care for a plant' },
];

function ForestRainVideo({ overlay = false }: { overlay?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(true);

  if (overlay) {
    return <video autoPlay loop muted playsInline onLoadedData={() => setLoaded(true)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 0.13 : 0, transition: 'opacity 1s', pointerEvents: 'none', borderRadius: 18 }} src="/forest-rain.mp4" />;
  }

  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative', background: 'rgba(0,0,0,0.3)' }}>
      <video autoPlay loop playsInline muted={muted} onLoadedData={() => setLoaded(true)} style={{ width: '100%', display: 'block', maxHeight: 280, objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.8s' }} src="/forest-rain.mp4" />
      {!loaded && <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--txt3)', fontSize: '0.85rem' }}><span style={{ fontSize: 28 }}>🌧️</span> Loading forest rain…</div>}
      {loaded && (
        <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 10, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600 }}>🌿 Forest Rain — AI generated</div>
          <button onClick={() => setMuted(m => !m)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

function VoiceToggle({ voiceOn, onToggle, isSupported }: any) {
  if (!isSupported) return null;
  return (
    <button onClick={onToggle} title={voiceOn ? 'Turn off voice guidance' : 'Turn on voice guidance'} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 20, border: `1.5px solid ${voiceOn ? 'rgba(78,205,196,0.5)' : 'var(--border)'}`, background: voiceOn ? 'rgba(78,205,196,0.1)' : 'var(--surface2)', color: voiceOn ? 'var(--teal)' : 'var(--txt3)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.2s' }}>
      {voiceOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
      {voiceOn ? 'Voice On' : 'Voice Off'}
    </button>
  );
}

function BreathingExercise({ pattern, onClose }: any) {
  const PHASES = pattern.holdOut > 0
    ? [
        { name: 'inhale', label: 'Breathe In', spoken: 'Breathe in slowly', duration: pattern.inhale, css: 'breath-inhale' },
        { name: 'hold', label: 'Hold', spoken: 'Hold your breath', duration: pattern.hold, css: 'breath-hold' },
        { name: 'exhale', label: 'Breathe Out', spoken: 'Breathe out gently', duration: pattern.exhale, css: 'breath-exhale' },
        { name: 'holdOut', label: 'Hold', spoken: 'Hold, and rest', duration: pattern.holdOut, css: 'breath-hold' },
      ]
    : [
        { name: 'inhale', label: 'Breathe In', spoken: 'Breathe in slowly', duration: pattern.inhale, css: 'breath-inhale' },
        { name: 'hold', label: 'Hold', spoken: 'Hold your breath', duration: pattern.hold, css: 'breath-hold' },
        { name: 'exhale', label: 'Breathe Out', spoken: 'Breathe out gently', duration: pattern.exhale, css: 'breath-exhale' },
      ];

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(PHASES[0].duration);
  const [cyclesDone, setCyclesDone] = useState(0);
  const [breathClass, setBreathClass] = useState('');
  const [voiceOn, setVoiceOn] = useState(true);
  const timerRef = useRef<any>(null);
  const { speak, stop, isSupported: voiceSupported } = useVoiceOver();

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  const handleStop = useCallback(() => {
    clearTimer(); stop();
    setRunning(false); setPhaseIdx(0);
    setCount(PHASES[0].duration); setCyclesDone(0); setBreathClass('');
  }, []);

  useEffect(() => {
    if (!running) return;
    let currentPhase = phaseIdx;
    let currentCount = count;
    setBreathClass(PHASES[currentPhase].css);

    timerRef.current = setInterval(() => {
      currentCount -= 1;
      setCount(currentCount);
      if (currentCount <= 0) {
        const nextPhase = (currentPhase + 1) % PHASES.length;
        const newCycles = nextPhase === 0 ? cyclesDone + 1 : cyclesDone;
        if (nextPhase === 0 && newCycles >= pattern.cycles) {
          clearTimer(); setRunning(false); setDone(true);
          if (voiceOn) speak('Well done! You completed the exercise. Take a moment to notice how calm you feel.');
          return;
        }
        currentPhase = nextPhase;
        currentCount = PHASES[currentPhase].duration;
        setPhaseIdx(currentPhase); setCount(currentCount); setBreathClass(PHASES[currentPhase].css);
        if (voiceOn) speak(PHASES[currentPhase].spoken);
        if (nextPhase === 0) setCyclesDone(newCycles);
      }
    }, 1000);
    return clearTimer;
  }, [running, phaseIdx]);

  const handleStart = () => {
    setRunning(true);
    if (voiceOn) speak(`Starting ${pattern.name}. Get comfortable, close your eyes, and follow along. ${PHASES[0].spoken}.`);
  };

  const progress = (cyclesDone / pattern.cycles) * 100;

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }} className="animate-scale-in">
        <ForestRainVideo overlay />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌟</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Beautifully Done!</h3>
          <p style={{ color: 'var(--txt2)', marginBottom: 28 }}>You completed {pattern.cycles} cycles of {pattern.name}. Notice how calm your body feels now.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn-muted" onClick={() => { setDone(false); setCyclesDone(0); stop(); }}>Repeat</button>
            <button className="btn-primary" onClick={onClose}>All Done ✓</button>
          </div>
        </div>
      </div>
    );
  }

  const currentPhaseData = PHASES[phaseIdx];
  return (
    <div style={{ textAlign: 'center', padding: '32px 24px', position: 'relative', overflow: 'hidden' }} className="animate-fade-up">
      <ForestRainVideo overlay />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <span style={{ fontSize: '1.3rem' }}>{pattern.emoji}</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{pattern.name}</h3>
        </div>
        <p style={{ color: 'var(--txt3)', fontSize: '0.84rem', marginBottom: 20 }}>{pattern.description}</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <VoiceToggle voiceOn={voiceOn} onToggle={() => { setVoiceOn((v: boolean) => !v); if (voiceOn) stop(); }} isSupported={voiceSupported} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div className={`breath-circle ${running ? breathClass : ''}`} style={{ width: 170, height: 170 }}>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: pattern.color, lineHeight: 1 }}>{running ? count : pattern.emoji}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--txt2)', marginTop: 6, fontWeight: 600 }}>{running ? currentPhaseData.label : 'Ready'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {PHASES.map((p, i) => (
            <div key={i} style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: running && i === phaseIdx ? (pattern.colorBg || 'rgba(78,205,196,0.12)') : 'var(--surface2)', color: running && i === phaseIdx ? pattern.color : 'var(--txt3)', border: `1.5px solid ${running && i === phaseIdx ? pattern.color + '44' : 'var(--border)'}`, transition: 'all 0.3s' }}>
              {p.label} {p.duration}s
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 280, margin: '0 auto 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--txt3)', marginBottom: 6 }}><span>Cycles</span><span>{cyclesDone} / {pattern.cycles}</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>
        {voiceSupported && voiceOn && !running && <p style={{ fontSize: '0.72rem', color: 'var(--teal)', marginBottom: 16, opacity: 0.85 }}>🔊 Voice guidance will read each phase aloud so you can follow with eyes closed</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {!running ? <button className="btn-primary" onClick={handleStart}><Play size={16} /> Start</button> : <button className="btn-muted" onClick={handleStop}><Square size={15} /> Stop</button>}
          <button className="btn-ghost" onClick={() => { handleStop(); onClose(); }}><ChevronLeft size={15} /> Back</button>
        </div>
      </div>
    </div>
  );
}

function MeditationGuide({ script, onClose }: any) {
  const [step, setStep] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [timerSec, setTimerSec] = useState(30);
  const timerRef = useRef<any>(null);
  const { speak, stop, isSupported: voiceSupported } = useVoiceOver();

  useEffect(() => {
    if (!autoAdvance) { clearInterval(timerRef.current); return; }
    setTimerSec(30);
    timerRef.current = setInterval(() => {
      setTimerSec(s => {
        if (s <= 1) { if (step < script.steps.length - 1) setStep((prev: number) => prev + 1); else clearInterval(timerRef.current); return 30; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [autoAdvance, step]);

  useEffect(() => { if (voiceOn && voiceSupported) speak(script.steps[step], { rate: 0.78 }); }, [step, voiceOn]);

  useEffect(() => {
    if (voiceOn && voiceSupported) speak(`Starting ${script.title}. ${script.steps.length} steps, ${script.duration}. ${script.steps[0]}`, { rate: 0.78 });
    return () => stop();
  }, []);

  const goToStep = (i: number) => { stop(); setStep(i); };
  const progress = ((step + 1) / script.steps.length) * 100;

  return (
    <div style={{ padding: '28px 24px', position: 'relative', overflow: 'hidden' }} className="animate-fade-up">
      <ForestRainVideo overlay />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{script.emoji}</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>{script.title}</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--txt3)' }}>{script.steps.length} steps · {script.duration}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          <VoiceToggle voiceOn={voiceOn} onToggle={() => { setVoiceOn((v: boolean) => !v); if (voiceOn) stop(); }} isSupported={voiceSupported} />
          {voiceOn && voiceSupported && <button onClick={() => speak(script.steps[step], { rate: 0.78 })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 20, border: '1.5px solid var(--border)', background: 'var(--surface2)', color: 'var(--txt2)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700 }}>🔁 Read again</button>}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.7rem', color: 'var(--txt3)' }}>
            <span>Step {step + 1} of {script.steps.length}</span>
            {autoAdvance && <span>Next in {timerSec}s</span>}
          </div>
        </div>
        <div style={{ background: 'rgba(78,205,196,0.06)', border: '1px solid rgba(78,205,196,0.18)', borderRadius: 16, padding: '24px 28px', minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <p style={{ fontSize: '1rem', color: 'var(--txt)', lineHeight: 1.8, textAlign: 'center' }}>{script.steps[step]}</p>
        </div>
        {voiceOn && voiceSupported && <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--teal)', marginBottom: 14, opacity: 0.85 }}>🔊 Instructions are being read aloud — close your eyes and listen</p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 22 }}>
          {script.steps.map((_: any, i: number) => (
            <button key={i} onClick={() => goToStep(i)} style={{ width: i === step ? 20 : 7, height: 7, borderRadius: 10, border: 'none', cursor: 'pointer', background: i === step ? 'var(--teal)' : i < step ? 'var(--teal-dim)' : 'var(--surface3)', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-muted" disabled={step === 0} onClick={() => goToStep(step - 1)}><ChevronLeft size={16} /> Prev</button>
          {step < script.steps.length - 1 ? <button className="btn-primary" onClick={() => goToStep(step + 1)}>Next <ChevronRight size={16} /></button> : <button className="btn-primary" onClick={() => { stop(); onClose(); }}>Complete ✓</button>}
          <button onClick={() => setAutoAdvance((a: boolean) => !a)} style={{ padding: '10px 14px', borderRadius: 12, border: '1.5px solid var(--border)', background: autoAdvance ? 'rgba(78,205,196,0.12)' : 'transparent', color: autoAdvance ? 'var(--teal)' : 'var(--txt3)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}>{autoAdvance ? '⏸ Pause Auto' : '▶ Auto'}</button>
          <button className="btn-ghost" onClick={() => { stop(); onClose(); }}>Exit</button>
        </div>
      </div>
    </div>
  );
}

function SoundCard({ sound, active, onToggle }: any) {
  return (
    <div>
      <button onClick={onToggle} className="card card-interactive" style={{ width: '100%', padding: '20px 18px', textAlign: 'left', border: active ? `1.5px solid ${sound.color}55` : undefined, background: active ? 'rgba(78,205,196,0.07)' : undefined }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>{sound.emoji}</div>
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--txt)', marginBottom: 3 }}>{sound.title}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--txt3)', marginBottom: 12 }}>{sound.desc}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: active ? 'rgba(78,205,196,0.2)' : 'var(--surface2)', color: active ? 'var(--teal)' : 'var(--txt3)', transition: 'all 0.2s' }}>
          {active ? '⏸ Playing' : '▶ Play'}
        </div>
      </button>
      {active && (
        <div style={{ borderRadius: 12, overflow: 'hidden', marginTop: 8, border: '1px solid var(--border)' }}>
          <iframe src={`https://www.youtube.com/embed/${sound.videoId}?autoplay=1&loop=1&playlist=${sound.videoId}&controls=1&modestbranding=1`} width="100%" height="160" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen title={sound.title} style={{ display: 'block' }} />
        </div>
      )}
    </div>
  );
}

export default function Activities() {
  const [activeBreathing, setActiveBreathing] = useState<any>(null);
  const [activeMeditation, setActiveMeditation] = useState<any>(null);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  if (activeBreathing) {
    return (
      <div>
        <button className="btn-muted" style={{ marginBottom: 16 }} onClick={() => setActiveBreathing(null)}><ChevronLeft size={15} /> All Activities</button>
        <div className="card" style={{ padding: 0 }}><BreathingExercise pattern={activeBreathing} onClose={() => setActiveBreathing(null)} /></div>
      </div>
    );
  }

  if (activeMeditation) {
    return (
      <div>
        <button className="btn-muted" style={{ marginBottom: 16 }} onClick={() => setActiveMeditation(null)}><ChevronLeft size={15} /> All Activities</button>
        <div className="card" style={{ padding: 0 }}><MeditationGuide script={activeMeditation} onClose={() => setActiveMeditation(null)} /></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Breathing */}
      <div>
        <div className="section-title" style={{ marginBottom: 14 }}>🌬️ Breathing Exercises</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {BREATHING_PATTERNS.map(p => (
            <button key={p.id} onClick={() => setActiveBreathing(p)} className="card card-interactive" style={{ padding: '20px 16px', textAlign: 'left', border: `1px solid ${p.color}33` }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{p.emoji}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--txt)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt3)', marginBottom: 12, lineHeight: 1.5 }}>{p.description}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, background: p.colorBg, color: p.color }}>{p.tag}</span>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, background: 'var(--surface2)', color: 'var(--txt3)' }}>{p.cycles} cycles</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Forest Rain */}
      <div>
        <div className="section-title" style={{ marginBottom: 14 }}>🌧️ Forest Rain — Focus & Calm</div>
        <ForestRainVideo />
      </div>

      {/* Meditation */}
      <div>
        <div className="section-title" style={{ marginBottom: 14 }}>🧘 Guided Meditation</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {MEDITATIONS.map(m => (
            <button key={m.id} onClick={() => setActiveMeditation(m)} className="card card-interactive" style={{ padding: '18px 16px', textAlign: 'left' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{m.emoji}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--txt)', marginBottom: 4 }}>{m.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--txt3)', marginBottom: 12 }}>{m.duration} · {m.steps.length} steps</div>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, background: 'var(--surface2)', color: m.color }}>{m.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ambient sounds */}
      <div>
        <div className="section-title" style={{ marginBottom: 14 }}>🎵 Ambient Sounds</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {AMBIENT_SOUNDS.map(s => (
            <SoundCard key={s.id} sound={s} active={activeSound === s.id} onToggle={() => setActiveSound(activeSound === s.id ? null : s.id)} />
          ))}
        </div>
      </div>

      {/* Coping tips */}
      <div>
        <div className="section-title" style={{ marginBottom: 14 }}>⚡ Quick Coping Tips</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {COPING_TIPS.map(({ emoji, tip }) => (
            <div key={tip} className="card" style={{ padding: '16px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{emoji}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--txt2)', lineHeight: 1.5 }}>{tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
