import { useCallback, useEffect, useRef, useState } from 'react';

export function useVoiceOver() {
  const [isSupported] = useState(() => typeof window !== 'undefined' && !!window.speechSynthesis);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if (!isSupported) return;
    const load = () => setVoicesLoaded(true);
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    } else {
      setVoicesLoaded(true);
    }
  }, [isSupported]);

  const getBestVoice = useCallback(() => {
    if (!isSupported) return null;
    const voices = window.speechSynthesis.getVoices();
    const preferred = ['Google UK English Female', 'Samantha', 'Karen', 'Moira', 'Google US English', 'Microsoft Aria', 'Microsoft Zira'];
    for (const name of preferred) {
      const v = voices.find(v => v.name.includes(name));
      if (v) return v;
    }
    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }, [voicesLoaded]);

  const speak = useCallback((text: string, opts: any = {}) => {
    if (!isSupported || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = opts.rate ?? 0.82;
    utter.pitch = opts.pitch ?? 1.05;
    utter.volume = opts.volume ?? 1;
    const voice = getBestVoice();
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  }, [getBestVoice, isSupported]);

  const stop = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
  }, [isSupported]);

  return { speak, stop, isSupported };
}
