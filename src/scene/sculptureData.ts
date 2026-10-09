import type { SculptureData } from './shapes';
import type { SculptureRequest } from './sculpture.worker';

export interface SculptureAssets {
  data: SculptureData;
  grain: Uint8Array | null;
}

/**
 * Generates the sculpture's vertex layouts and grain texture off the main thread,
 * so scrolling and input stay responsive while the scene is prepared.
 * Falls back to the main thread where module workers are unavailable.
 */
export async function loadSculptureAssets(request: SculptureRequest): Promise<SculptureAssets> {
  if (typeof Worker !== 'undefined') {
    try {
      return await new Promise<SculptureAssets>((resolve, reject) => {
        const worker = new Worker(new URL('./sculpture.worker.ts', import.meta.url), { type: 'module' });
        const timer = window.setTimeout(() => {
          worker.terminate();
          reject(new Error('sculpture worker timed out'));
        }, 6000);
        worker.onmessage = (event: MessageEvent<SculptureAssets>) => {
          window.clearTimeout(timer);
          worker.terminate();
          resolve(event.data);
        };
        worker.onerror = (error) => {
          window.clearTimeout(timer);
          worker.terminate();
          reject(error);
        };
        worker.postMessage(request);
      });
    } catch {
      // Fall through to the main-thread path.
    }
  }
  const { buildGrainData, buildSculptureData } = await import('./shapes');
  return {
    data: buildSculptureData(request.segments, request.rings),
    grain: request.grainSize > 0 ? buildGrainData(request.grainSize) : null,
  };
}
