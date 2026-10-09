import { useEffect, useState } from 'react';

export interface LatestCommit {
  sha: string;
  url: string;
}

const ENDPOINT = 'https://api.github.com/repos/StanSmits/Portfolio-Site/commits?per_page=1';

/** Fetches the latest commit of this site's repository once the browser is idle. Never blocks rendering. */
export function useLatestCommit(): LatestCommit | null {
  const [commit, setCommit] = useState<LatestCommit | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        const response = await fetch(ENDPOINT, { signal: controller.signal });
        if (!response.ok) return;
        const data: unknown = await response.json();
        const first = Array.isArray(data) ? data[0] : null;
        if (first && typeof first.sha === 'string' && typeof first.html_url === 'string') {
          setCommit({ sha: first.sha, url: first.html_url });
        }
      } catch {
        // Offline, rate-limited or aborted: the footer simply omits the commit link.
      }
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const handle = idle(() => void run());
    return () => {
      controller.abort();
      if (window.cancelIdleCallback && typeof handle === 'number') window.cancelIdleCallback(handle);
    };
  }, []);

  return commit;
}
