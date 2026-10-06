import { useEffect, useState } from 'react';
import { checkAIAvailability } from '../lib/groq';

export function useAiStatus() {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    checkAIAvailability().then(status => {
      if (active) setAvailable(status);
    });
    return () => {
      active = false;
    };
  }, []);

  return available;
}
