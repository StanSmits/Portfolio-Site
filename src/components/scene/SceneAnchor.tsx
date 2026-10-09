import type { CSSProperties } from 'react';
import { useSceneStatus } from './SceneContext';

interface SceneAnchorProps {
  className?: string;
  /** Show the CSS sculpture here while 3D is loading or unavailable. */
  fallback?: 'stack' | 'exploded' | false;
  style?: CSSProperties;
}

/**
 * Marks where the 3D sculpture should sit within a section. The scene engine reads its
 * position every frame, so the responsive layout — not hard-coded numbers — decides
 * where the object goes. Purely decorative.
 */
export function SceneAnchor({ className = '', fallback = false, style }: SceneAnchorProps) {
  const status = useSceneStatus();
  const showFallback = fallback !== false && status !== 'ready';
  return (
    <div data-scene-anchor className={className} style={style} aria-hidden="true">
      {fallback !== false && (
        <div
          className="h-full w-full transition-opacity duration-1000 ease-out"
          style={{ opacity: showFallback ? 1 : 0 }}
        >
          <CssSculpture variant={fallback} />
        </div>
      )}
    </div>
  );
}

const SLABS = [0, 1, 2, 3, 4, 5];

/** A static, CSS-only rendition of the stacked sculpture — used without WebGL. */
export function CssSculpture({ variant }: { variant: 'stack' | 'exploded' }) {
  return (
    <div className="sculpture" style={{ height: '100%', width: 'auto', maxWidth: '100%' }}>
      <div className="sculpture-stack">
        {SLABS.map((i) => (
          <div
            key={i}
            className="sculpture-slab"
            style={{ '--i': variant === 'exploded' ? i * 1.6 : i } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
