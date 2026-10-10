export interface ShareDeps {
  title: string;
  url: string;
  nav: {
    share?: (data: { title: string; url: string }) => Promise<void>;
    clipboard?: { writeText: (text: string) => Promise<void> };
  };
}

export type ShareResult = 'shared' | 'aborted' | 'copied' | 'failed';

/**
 * Partage via la Web Share API ; à défaut (ou si elle échoue hors annulation), copie l'URL.
 * L'annulation (`AbortError`) est silencieuse ; un échec de copie est signalé par 'failed'.
 */
export async function share({ title, url, nav }: ShareDeps): Promise<ShareResult> {
  if (typeof nav.share === 'function') {
    try {
      await nav.share({ title, url });
      return 'shared';
    } catch (error) {
      if ((error as { name?: string } | null)?.name === 'AbortError') return 'aborted';
    }
  }
  try {
    if (!nav.clipboard) return 'failed';
    await nav.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
