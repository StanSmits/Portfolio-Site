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
 *
 * This module is pure math (no three.js, no DOM) so it can run inside a Web Worker.
 */

export interface SculptureData {
  index: Uint32Array;
  uv: Float32Array;
  /** [stone, stack, exploded, calm] */
  positions: [Float32Array, Float32Array, Float32Array, Float32Array];
  normals: [Float32Array, Float32Array, Float32Array, Float32Array];
}

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

/** Builds all four layouts. Vertex order and winding match THREE.SphereGeometry. */
export function buildSculptureData(widthSegments: number, ringsPerSlab: number): SculptureData {
  const heightSegments = SLAB_COUNT * ringsPerSlab;
  const row = widthSegments + 1;
  const count = row * (heightSegments + 1);
  const noise = createNoise3D(11);

  const stone = new Float32Array(count * 3);
  const stack = new Float32Array(count * 3);
  const exploded = new Float32Array(count * 3);
  const calm = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);

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
    const v = iy / heightSegments;
    const theta = v * Math.PI;
    for (let ix = 0; ix <= widthSegments; ix++) {
      const i = iy * row + ix;
      const u = ix / widthSegments;
      const phi = u * Math.PI * 2;
      const dx = -Math.cos(phi) * Math.sin(theta);
      const dy = Math.cos(theta);
      const dz = Math.sin(phi) * Math.sin(theta);

      uv[i * 2] = u;
      uv[i * 2 + 1] = 1 - v;

      // Stone: low-frequency displacement with a slight lean.
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

  // Index buffer (same triangulation as THREE.SphereGeometry, without degenerate pole triangles).
  const indices: number[] = [];
  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < widthSegments; ix++) {
      const a = iy * row + ix + 1;
      const b = iy * row + ix;
      const c = (iy + 1) * row + ix;
      const d = (iy + 1) * row + ix + 1;
      if (iy !== 0) indices.push(a, b, d);
      if (iy !== heightSegments - 1) indices.push(b, c, d);
    }
  }
  const index = new Uint32Array(indices);

  const positions: SculptureData['positions'] = [stone, stack, exploded, calm];
  const normals = positions.map((p) => computeNormals(p, index, widthSegments, heightSegments)) as SculptureData['normals'];
  return { index, uv, positions, normals };
}

/** Area-weighted vertex normals, welded across the UV seam and at the poles. */
function computeNormals(positions: Float32Array, index: Uint32Array, w: number, h: number): Float32Array {
  const normals = new Float32Array(positions.length);
  for (let t = 0; t < index.length; t += 3) {
    const a = index[t] * 3;
    const b = index[t + 1] * 3;
    const c = index[t + 2] * 3;
    const cbx = positions[c] - positions[b];
    const cby = positions[c + 1] - positions[b + 1];
    const cbz = positions[c + 2] - positions[b + 2];
    const abx = positions[a] - positions[b];
    const aby = positions[a + 1] - positions[b + 1];
    const abz = positions[a + 2] - positions[b + 2];
    const nx = cby * abz - cbz * aby;
    const ny = cbz * abx - cbx * abz;
    const nz = cbx * aby - cby * abx;
    for (const v of [a, b, c]) {
      normals[v] += nx;
      normals[v + 1] += ny;
      normals[v + 2] += nz;
    }
  }

  const row = w + 1;
  for (let iy = 0; iy <= h; iy++) {
    const a = iy * row * 3;
    const b = (iy * row + w) * 3;
    for (let c = 0; c < 3; c++) {
      const sum = normals[a + c] + normals[b + c];
      normals[a + c] = sum;
      normals[b + c] = sum;
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
    for (let ix = 0; ix <= w; ix++) {
      const o = (iy * row + ix) * 3;
      normals[o] = x;
      normals[o + 1] = y;
      normals[o + 2] = z;
    }
  }
  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
    normals[i] /= len;
    normals[i + 1] /= len;
    normals[i + 2] /= len;
  }
  return normals;
}

/** Tileable grayscale grain (RGBA bytes) used as a subtle roughness/bump texture. */
export function buildGrainData(size: number): Uint8Array {
  const data = new Uint8Array(size * size * 4);
  const noise = createNoise3D(3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Tileable by sampling a torus in 3D noise space.
      const u = (x / size) * Math.PI * 2;
      const v = (y / size) * Math.PI * 2;
      const nx = Math.cos(u) * 2.2;
      const ny = Math.sin(u) * 2.2;
      const nz = Math.cos(v) * 2.2 + Math.sin(v) * 1.3;
      const n = 0.6 * noise(nx * 2, ny * 2, nz * 2) + 0.4 * noise(nx * 7, ny * 7, nz * 7 + Math.sin(v) * 3);
      const value = Math.round(Math.min(1, Math.max(0, 0.86 + n * 0.14)) * 255);
      const o = (y * size + x) * 4;
      data[o] = value;
      data[o + 1] = value;
      data[o + 2] = value;
      data[o + 3] = 255;
    }
  }
  return data;
}
