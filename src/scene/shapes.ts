import { BufferAttribute, BufferGeometry, SphereGeometry } from 'three';
import { createNoise3D, fbm } from './noise';

/**
 * The sculpture is a single sphere-topology mesh with four vertex layouts that share
 * the same index buffer, so the renderer can genuinely interpolate between them
 * (three.js morph targets on position and normal):
 *
 *   0. stone     — the base: a softly irregular, organic form
 *   1. stack     — the same vertices folded into a twisted stack of slabs
 *   2. exploded  — the stack pulled apart along a thin spine
 *   3. calm      — a low, resolved pebble for the end of the page
 *
 * Latitude rings are distributed per slab so that slab faces, edges and walls
 * land on exact rings, which keeps the architectural edges crisp.
 */

export const MORPH = { stack: 0, exploded: 1, calm: 2 } as const;

const SLAB_COUNT = 7;
const SUPERELLIPSE_N = 4.6;
const CORE = 0.16;

interface Slab {
  top: number;
  bottom: number;
  wx: number;
  wz: number;
  angle: number;
  ox: number;
  oz: number;
}

/** Relative thickness, footprint and twist of each slab, top to bottom. */
const SLAB_SPEC = [
  { t: 0.75, wx: 0.86, wz: 0.66, a: 0.0 },
  { t: 1.35, wx: 1.08, wz: 0.82, a: 0.2 },
  { t: 0.55, wx: 0.78, wz: 0.94, a: -0.14 },
  { t: 1.7, wx: 1.18, wz: 0.78, a: 0.34 },
  { t: 0.65, wx: 0.96, wz: 0.9, a: 0.06 },
  { t: 1.15, wx: 1.06, wz: 0.7, a: -0.24 },
  { t: 0.95, wx: 0.84, wz: 0.82, a: 0.12 },
] as const;

function layoutSlabs(totalHeight: number, gap: number, spread: number, twist: number, shrink: number): Slab[] {
  const weights = SLAB_SPEC.reduce((sum, s) => sum + s.t, 0);
  const usable = totalHeight - gap * (SLAB_COUNT - 1);
  let y = totalHeight / 2;
  return SLAB_SPEC.map((spec, k) => {
    const h = (spec.t / weights) * usable;
    const slab: Slab = {
      top: y,
      bottom: y - h,
      wx: spec.wx * shrink,
      wz: spec.wz * shrink,
      angle: spec.a * twist + k * 0.11 * (twist - 1),
      ox: Math.sin(k * 1.9 + 0.4) * spread,
      oz: Math.cos(k * 2.3 + 1.1) * spread * 0.6,
    };
    y -= h + gap;
    return slab;
  });
}

const sgnPow = (v: number, p: number) => Math.sign(v) * Math.pow(Math.abs(v), p);

export interface SculptureGeometry {
  geometry: BufferGeometry;
  dispose: () => void;
}

export function createSculptureGeometry(widthSegments: number, ringsPerSlab: number): SculptureGeometry {
  const heightSegments = SLAB_COUNT * ringsPerSlab;
  const sphere = new SphereGeometry(1, widthSegments, heightSegments);
  const count = sphere.attributes.position.count;
  const noise = createNoise3D(11);

  const stone = new Float32Array(count * 3);
  const stack = new Float32Array(count * 3);
  const exploded = new Float32Array(count * 3);
  const calm = new Float32Array(count * 3);

  const compactSlabs = layoutSlabs(2.15, 0.012, 0.04, 1, 1);
  const explodedSlabs = layoutSlabs(3.1, 0.3, 0.3, 2.4, 0.86);

  const faceRings = Math.max(2, Math.round(ringsPerSlab * 0.2));
  const exponent = 2 / SUPERELLIPSE_N;

  const writeSlabVertex = (out: Float32Array, i: number, slabs: Slab[], iy: number, phi: number) => {
    let k: number;
    let j: number;
    if (iy >= heightSegments) {
      k = SLAB_COUNT - 1;
      j = ringsPerSlab - 1;
    } else {
      k = Math.floor(iy / ringsPerSlab);
      j = iy - k * ringsPerSlab;
    }
    const slab = slabs[k];
    const last = ringsPerSlab - 1;
    const cIn = k === 0 ? 0 : CORE;
    const cOut = k === SLAB_COUNT - 1 || iy >= heightSegments ? 0 : CORE;
    const wallEnd = last - faceRings;

    let r: number;
    let y: number;
    if (j <= faceRings) {
      const u = j / faceRings;
      r = cIn + (1 - cIn) * (1 - (1 - u) * (1 - u));
      y = slab.top;
    } else if (j < wallEnd) {
      const v = (j - faceRings) / (wallEnd - faceRings);
      r = 1;
      y = slab.top + (slab.bottom - slab.top) * (0.5 - 0.5 * Math.cos(Math.PI * v));
    } else {
      const u = (j - wallEnd) / faceRings;
      r = 1 + (cOut - 1) * u * u;
      y = slab.bottom;
    }
    if (iy >= heightSegments) r = 0;

    const lx = -sgnPow(Math.cos(phi), exponent) * slab.wx * r;
    const lz = sgnPow(Math.sin(phi), exponent) * slab.wz * r;
    const ca = Math.cos(slab.angle);
    const sa = Math.sin(slab.angle);
    out[i * 3] = lx * ca - lz * sa + slab.ox;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = lx * sa + lz * ca + slab.oz;
  };

  for (let iy = 0; iy <= heightSegments; iy++) {
    const theta = (iy / heightSegments) * Math.PI;
    for (let ix = 0; ix <= widthSegments; ix++) {
      const i = iy * (widthSegments + 1) + ix;
      const phi = (ix / widthSegments) * Math.PI * 2;
      const dx = -Math.cos(phi) * Math.sin(theta);
      const dy = Math.cos(theta);
      const dz = Math.sin(phi) * Math.sin(theta);

      // Stone: low-frequency fbm displacement with a slight lean.
      const rs = 1 + 0.14 * noise(dx * 0.85, dy * 0.85, dz * 0.85) + 0.035 * noise(dx * 2.1 + 9, dy * 2.1, dz * 2.1);
      stone[i * 3] = dx * rs * 1.12 + dy * 0.1;
      stone[i * 3 + 1] = dy * rs * 0.94;
      stone[i * 3 + 2] = dz * rs * 0.98;

      writeSlabVertex(stack, i, compactSlabs, iy, phi);
      writeSlabVertex(exploded, i, explodedSlabs, iy, phi);

      // Calm: a low, nearly still pebble.
      const rc = 1 + 0.06 * fbm(noise, dx * 0.9 + 20, dy * 0.9, dz * 0.9, 2);
      calm[i * 3] = dx * rc * 1.24;
      calm[i * 3 + 1] = dy * rc * 0.6;
      calm[i * 3 + 2] = dz * rc * 1.14;
    }
  }

  const index = sphere.getIndex();
  const normalsFor = (positions: Float32Array) => {
    const tmp = new BufferGeometry();
    tmp.setIndex(index);
    tmp.setAttribute('position', new BufferAttribute(positions, 3));
    tmp.computeVertexNormals();
    const normals = (tmp.getAttribute('normal') as BufferAttribute).array as Float32Array;
    weldNormals(normals, widthSegments, heightSegments);
    tmp.dispose();
    return normals;
  };

  const geometry = new BufferGeometry();
  geometry.setIndex(index);
  geometry.setAttribute('position', new BufferAttribute(stone, 3));
  geometry.setAttribute('normal', new BufferAttribute(normalsFor(stone), 3));
  geometry.setAttribute('uv', sphere.getAttribute('uv'));
  geometry.morphAttributes.position = [
    new BufferAttribute(stack, 3),
    new BufferAttribute(exploded, 3),
    new BufferAttribute(calm, 3),
  ];
  geometry.morphAttributes.normal = [
    new BufferAttribute(normalsFor(stack), 3),
    new BufferAttribute(normalsFor(exploded), 3),
    new BufferAttribute(normalsFor(calm), 3),
  ];
  geometry.computeBoundingSphere();
  if (geometry.boundingSphere) geometry.boundingSphere.radius = 2.4;
  sphere.dispose();

  return { geometry, dispose: () => geometry.dispose() };
}

/** Average normals across the UV seam and at the poles, which are duplicated vertices. */
function weldNormals(normals: Float32Array, w: number, h: number) {
  const row = w + 1;
  for (let iy = 0; iy <= h; iy++) {
    const a = iy * row * 3;
    const b = (iy * row + w) * 3;
    for (let c = 0; c < 3; c++) {
      const avg = (normals[a + c] + normals[b + c]) / 2;
      normals[a + c] = avg;
      normals[b + c] = avg;
    }
  }
  for (const iy of [0, h]) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (let ix = 0; ix <= w; ix++) {
      const o = (iy * row + ix) * 3;
      x += normals[o];
      y += normals[o + 1];
      z += normals[o + 2];
    }
    const len = Math.hypot(x, y, z) || 1;
    for (let ix = 0; ix <= w; ix++) {
      const o = (iy * row + ix) * 3;
      normals[o] = x / len;
      normals[o + 1] = y / len;
      normals[o + 2] = z / len;
    }
  }
  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
    normals[i] /= len;
    normals[i + 1] /= len;
    normals[i + 2] /= len;
  }
}
