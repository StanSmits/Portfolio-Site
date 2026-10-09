import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { detectCapabilities } from '../../scene/capabilities';
import type { SceneEngine } from '../../scene/engine';
import { SceneStatusContext, type SceneStatus } from './SceneContext';

/** Give up on the 3D scene (and show the static visual) if it is not rendering by then. */
const READY_TIMEOUT_MS = 9000;

/**
 * Hosts the fixed WebGL canvas behind the page. The three.js bundle is loaded lazily
 * once the browser is idle, so text and navigation are never blocked by 3D work.
 */
export function SceneProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const capabilities = useMemo(() => detectCapabilities(), []);
  const [status, setStatus] = useState<SceneStatus>(capabilities.webgl ? 'pending' : 'fallback');
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SceneEngine | null>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const container = containerRef.current;
    if (!capabilities.webgl || !container) return;

    let cancelled = false;
    let engine: SceneEngine | null = null;
    const readyRef = { current: false };
    setStatus('pending');

    const fail = () => {
      if (cancelled) return;
      engine?.dispose();
      engine = null;
      engineRef.current = null;
      setStatus('fallback');
    };

    // Never leave the page waiting on 3D: fall back if the first frame has not arrived in time.
    const timeout = window.setTimeout(() => {
      if (!readyRef.current) fail();
    }, READY_TIMEOUT_MS);

    const start = async () => {
      try {
        const { createSceneEngine } = await import('../../scene/engine');
        if (cancelled) return;
        const forced = new URLSearchParams(window.location.search).get('scene') === 'force';
        engine = createSceneEngine({
          container,
          theme: themeRef.current,
          tier: capabilities.tier,
          reducedMotion,
          finePointer: capabilities.finePointer,
          forced,
          onReady: () => {
            if (cancelled) return;
            readyRef.current = true;
            setStatus('ready');
          },
          onFailure: fail,
        });
        engineRef.current = engine;
        if (import.meta.env.DEV) (window as unknown as { __scene?: SceneEngine }).__scene = engine;
        await engine.start();
      } catch (error) {
        if (import.meta.env.DEV) console.warn('3D scene unavailable, using static visual.', error);
        fail();
      }
    };

    const idle =
      window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb as () => void, 300));
    const handle = idle(() => void start(), { timeout: 1200 });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
      engine?.dispose();
      engineRef.current = null;
    };
    // The current theme is read through a ref so a theme change does not rebuild the scene.
  }, [capabilities, reducedMotion]);

  useEffect(() => {
    engineRef.current?.setTheme(theme);
  }, [theme]);

  const className = [
    'scene-layer',
    status === 'ready' ? 'is-ready' : '',
    reducedMotion ? 'is-static' : '',
  ].join(' ');

  return (
    <SceneStatusContext.Provider value={status}>
      <div ref={containerRef} className={className} aria-hidden="true" data-scene-status={status} />
      {children}
    </SceneStatusContext.Provider>
  );
}
