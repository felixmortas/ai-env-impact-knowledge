import { useEffect, useRef, useState } from 'react';
import CopyFeedback, { useFeedback } from './CopyFeedback';
import { share } from '../lib/share';

interface Props {
  title: string;
  url: string;
  label: string;
  copied: string;
  failed: string;
  urlLabel: string;
}

/** Îlot `client:only` : rien n'est rendu côté serveur, donc aucun bouton sans JavaScript. */
export default function ShareButton({ title, url, label, copied, failed, urlLabel }: Props) {
  const { feedback, show } = useFeedback();
  const [showUrl, setShowUrl] = useState(false);
  const busy = useRef(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showUrl) input.current?.focus();
  }, [showUrl]);

  async function onClick() {
    if (busy.current) return;
    busy.current = true;
    setShowUrl(false);
    try {
      const result = await share({ title, url, nav: navigator });
      if (result === 'copied') show({ kind: 'success', message: copied });
      else if (result === 'failed') {
        show({ kind: 'error', message: failed });
        setShowUrl(true);
      } else show(null);
    } catch {
      show({ kind: 'error', message: failed });
      setShowUrl(true);
    } finally {
      busy.current = false;
    }
  }

  return (
    <span className="share">
      <button type="button" className="share-button" onClick={onClick}>{label}</button>
      <CopyFeedback feedback={feedback} />
      {showUrl && (
        <input ref={input} className="share-url" type="text" readOnly value={url} aria-label={urlLabel} onFocus={(e) => e.currentTarget.select()} />
      )}
    </span>
  );
}
