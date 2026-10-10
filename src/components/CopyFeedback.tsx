import { useCallback, useEffect, useRef, useState } from 'react';

export interface Feedback {
  kind: 'success' | 'error';
  message: string;
}

/** État de confirmation : le succès disparaît après `ms`, l'erreur reste affichée. */
export function useFeedback(ms = 3000) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = useCallback((next: Feedback | null) => {
    clearTimeout(timer.current);
    setFeedback(next);
    if (next?.kind === 'success') timer.current = setTimeout(() => setFeedback(null), ms);
  }, [ms]);
  return { feedback, show };
}

/** Région `aria-live` toujours présente (pour que le changement de contenu soit annoncé) et visible. */
export default function CopyFeedback({ feedback }: { feedback: Feedback | null }) {
  return (
    <span className={`copy-feedback${feedback ? ` copy-feedback-${feedback.kind}` : ''}`} aria-live="polite">
      {feedback?.message}
    </span>
  );
}
