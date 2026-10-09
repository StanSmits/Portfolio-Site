/**
 * Device capability checks that run before the 3D bundle is downloaded.
 * Deliberately free of three.js imports so they stay in the main chunk.
 */

export type QualityTier = 'high' | 'medium' | 'low';

export interface SceneCapabilities {
  webgl: boolean;
  tier: QualityTier;
  /** Fine pointer (mouse/trackpad) available for hover-driven interaction. */
  finePointer: boolean;
}

function forcedByUrl(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('scene') === 'force';
  } catch {
    return false;
  }
}

export function detectWebGL(): boolean {
  if (forcedByUrl()) return true;
  try {
    const canvas = document.createElement('canvas');
    // Refuse software rasterisers: on those devices a static visual is the better experience.
    const attributes: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
    const gl =
      (canvas.getContext('webgl2', attributes) as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl', attributes) as WebGLRenderingContext | null);
    if (!gl) return false;
    const software = isSoftwareRenderer(gl);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !software;
  } catch {
    return false;
  }
}

/** CPU rasterisers (SwiftShader, llvmpipe…) would make every frame block the main thread. */
function isSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
  return /swiftshader|llvmpipe|softpipe|software|basic render driver/i.test(renderer);
}

export function detectCapabilities(): SceneCapabilities {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 600;

  let tier: QualityTier = 'high';
  if (!finePointer || smallScreen || cores <= 4) tier = 'medium';
  if (memory <= 2 || cores <= 2) tier = 'low';

  return { webgl: detectWebGL(), tier, finePointer };
}
