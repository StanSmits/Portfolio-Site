/**
 * Scroll choreography. Each page section is a "chapter" with a target state for the
 * sculpture and its environment. The engine blends between neighbouring chapters by
 * scroll position and then eases toward the blended target every frame.
 *
 * Where the sculpture sits on screen is not hard-coded: every section contains a
 * `[data-scene-anchor]` element, so the responsive layout decides where the 3D object
 * goes and it never lands on top of text.
 */

/** Morph target slots on the sculpture mesh (stone is the base shape). */
export const MORPH = { stack: 0, exploded: 1, calm: 2 } as const;

export const CHAPTERS = ['top', 'work', 'about', 'experience', 'contact'] as const;
export type ChapterId = (typeof CHAPTERS)[number];

export interface ChapterState {
  /** Morph target weights: [stack, exploded, calm]. Stone is the base shape. */
  morph: [number, number, number];
  /** Base rotation in radians. */
  rotX: number;
  rotY: number;
  rotZ: number;
  /** Camera distance. */
  dolly: number;
  /** Horizontal spread of the architectural panels. */
  spread: number;
  /** How far the panels have sunk below the floor. */
  sink: number;
  /** Floor grid visibility (0–1). */
  grid: number;
  /** Blend from stone material toward the lighter "structured" material (0–1). */
  structure: number;
  /** Extra uniform scale on top of the anchor-derived size. */
  scale: number;
}

export const CHAPTER_STATES: Record<ChapterId, ChapterState> = {
  top: {
    morph: [0, 0, 0],
    rotX: 0.12,
    rotY: -0.55,
    rotZ: 0.04,
    dolly: 7,
    spread: 1,
    sink: 0,
    grid: 0.55,
    structure: 0,
    scale: 0.8,
  },
  work: {
    morph: [1, 0, 0],
    rotX: 0.28,
    rotY: 0.55,
    rotZ: 0,
    dolly: 7.4,
    spread: 1.15,
    sink: 0,
    grid: 1,
    structure: 1,
    scale: 0.92,
  },
  about: {
    morph: [0, 1, 0],
    rotX: 0.16,
    rotY: 1.45,
    rotZ: -0.04,
    dolly: 7,
    spread: 1.75,
    sink: 0.4,
    grid: 0.45,
    structure: 0.85,
    scale: 0.78,
  },
  experience: {
    morph: [0.6, 0.4, 0],
    rotX: 0.34,
    rotY: 2.3,
    rotZ: 0,
    dolly: 7.5,
    spread: 1.35,
    sink: 1.2,
    grid: 0.8,
    structure: 0.9,
    scale: 0.85,
  },
  contact: {
    morph: [0, 0, 1],
    rotX: 0.08,
    rotY: 3.1,
    rotZ: 0,
    dolly: 7.6,
    spread: 0.7,
    sink: 6,
    grid: 0.15,
    structure: 0.2,
    scale: 1,
  },
};

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function blendStates(a: ChapterState, b: ChapterState, t: number, out: ChapterState): ChapterState {
  out.morph[0] = lerp(a.morph[0], b.morph[0], t);
  out.morph[1] = lerp(a.morph[1], b.morph[1], t);
  out.morph[2] = lerp(a.morph[2], b.morph[2], t);
  out.rotX = lerp(a.rotX, b.rotX, t);
  out.rotY = lerp(a.rotY, b.rotY, t);
  out.rotZ = lerp(a.rotZ, b.rotZ, t);
  out.dolly = lerp(a.dolly, b.dolly, t);
  out.spread = lerp(a.spread, b.spread, t);
  out.sink = lerp(a.sink, b.sink, t);
  out.grid = lerp(a.grid, b.grid, t);
  out.structure = lerp(a.structure, b.structure, t);
  out.scale = lerp(a.scale, b.scale, t);
  return out;
}

export function cloneState(state: ChapterState): ChapterState {
  return { ...state, morph: [...state.morph] as [number, number, number] };
}

/**
 * Converts the scroll position into a fractional chapter index. Transitions are
 * concentrated around section boundaries so each section has a settled composition.
 */
export function chapterProgress(
  sectionTops: number[],
  scrollY: number,
  viewportHeight: number,
  documentHeight: number
): number {
  const probe = scrollY + viewportHeight * 0.5;
  // The deepest the probe can reach; the final transition must complete before it.
  const maxProbe = Math.max(probe, documentHeight - viewportHeight * 0.5);
  let progress = 0;
  for (let i = 1; i < sectionTops.length; i++) {
    const boundary = sectionTops[i];
    const end = Math.min(boundary + viewportHeight * 0.15, maxProbe - viewportHeight * 0.05);
    const start = Math.min(boundary - viewportHeight * 0.55, end - viewportHeight * 0.3);
    progress += smoothstep(start, end, probe);
  }
  return progress;
}
