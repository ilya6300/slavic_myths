import { useCallback, useEffect, useState } from 'react';

const CHARS_PER_SEC = 30;

export function useTypewriter(text: string, active: boolean): {
  displayText: string;
  isComplete: boolean;
  revealAll: () => void;
} {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
  }, [text]);

  useEffect(() => {
    if (!active || visibleChars >= text.length) return;

    const timer = window.setInterval(() => {
      setVisibleChars((n) => Math.min(text.length, n + 1));
    }, 1000 / CHARS_PER_SEC);

    return () => window.clearInterval(timer);
  }, [active, text, visibleChars]);

  const revealAll = useCallback(() => {
    setVisibleChars(text.length);
  }, [text.length]);

  return {
    displayText: text.slice(0, visibleChars),
    isComplete: visibleChars >= text.length,
    revealAll,
  };
}
