import CopyFeedback, { useFeedback } from './CopyFeedback';

interface Props {
  text: string;
  label: string;
  copied: string;
  failed: string;
}

/** Îlot `client:only` : le bouton n'existe pas sans JavaScript. */
export default function CopyButton({ text, label, copied, failed }: Props) {
  const { feedback, show } = useFeedback();
  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      show({ kind: 'success', message: copied });
    } catch {
      show({ kind: 'error', message: failed });
    }
  }
  return (
    <span className="share">
      <button type="button" className="share-button" onClick={onClick}>{label}</button>
      <CopyFeedback feedback={feedback} />
    </span>
  );
}
