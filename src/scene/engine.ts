import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type Texture,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Theme } from '../theme/theme';
import type { QualityTier } from './capabilities';
import {
  CHAPTERS,
  CHAPTER_STATES,
  blendStates,
  chapterProgress,
  cloneState,
  lerp,
  type ChapterState,
} from './choreography';
import { createNoise3D } from './noise';
import { PALETTES, type ScenePalette } from './palettes';
import { createSculptureGeometry, MORPH } from './shapes';

export interface SceneEngineOptions {
  container: HTMLElement;
  theme: Theme;
  tier: QualityTier;
  reducedMotion: boolean;
  finePointer: boolean;
  forced?: boolean;
  onReady: () => void;
  onFailure: (reason: string) => void;
}

const TIERS: Record<QualityTier, { segments: number; rings: number; maxDpr: number; antialias: boolean }> = {
  high: { segments: 192, rings: 20, maxDpr: 2, antialias: true },
  medium: { segments: 128, rings: 14, maxDpr: 1.5, antialias: true },
  low: { segments: 96, rings: 10, maxDpr: 1, antialias: false },
};

const FOV = 30;
const OBJECT_HEIGHT = 2.3;
const SETTLE_EPSILON = 0.0006;

/** Frame-rate independent exponential easing. */
const damp = (current: number, target: number, lambda: number, dt: number) =>
  lambda === Infinity ? target : lerp(current, target, 1 - Math.exp(-lambda * dt));

interface Placement {
  cx: number;
  cy: number;
  size: number;
}

interface LivePalette {
  stone: Color;
  structured: Color;
  panel: Color;
  grid: Color;
  shadow: Color;
  hemiSky: Color;
  hemiGround: Color;
  key: Color;
  rim: Color;
  fog: Color;
  roughness: number;
  gridOpacity: number;
  shadowOpacity: number;
  hemiIntensity: number;
  keyIntensity: number;
  rimIntensity: number;
  envIntensity: number;
  fogNear: number;
  fogFar: number;
}

function toLivePalette(p: ScenePalette): LivePalette {
  return {
    stone: new Color(p.stone),
    structured: new Color(p.structured),
    panel: new Color(p.panel),
    grid: new Color(p.grid),
    shadow: new Color(p.shadow),
    hemiSky: new Color(p.hemiSky),
    hemiGround: new Color(p.hemiGround),
    key: new Color(p.key),
    rim: new Color(p.rim),
    fog: new Color(p.background),
    roughness: p.roughness,
    gridOpacity: p.gridOpacity,
    shadowOpacity: p.shadowOpacity,
    hemiIntensity: p.hemiIntensity,
    keyIntensity: p.keyIntensity,
    rimIntensity: p.rimIntensity,
    envIntensity: p.envIntensity,
    fogNear: p.fogNear,
    fogFar: p.fogFar,
  };
}

const PALETTE_COLOR_KEYS = [
  'stone',
  'structured',
  'panel',
  'grid',
  'shadow',
  'hemiSky',
  'hemiGround',
  'key',
  'rim',
  'fog',
] as const;
const PALETTE_NUMBER_KEYS = [
  'roughness',
  'gridOpacity',
  'shadowOpacity',
  'hemiIntensity',
  'keyIntensity',
  'rimIntensity',
  'envIntensity',
  'fogNear',
  'fogFar',
] as const;

/** Architectural panels standing behind the sculpture. */
const PANELS = [
  { x: -5.4, z: -6.2, w: 1.7, h: 3.6, r: 0.18 },
  { x: -3.0, z: -9.0, w: 2.8, h: 5.2, r: -0.1 },
  { x: -1.1, z: -5.4, w: 0.9, h: 2.5, r: 0.32 },
  { x: 1.8, z: -9.6, w: 2.3, h: 4.6, r: 0.06 },
  { x: 3.9, z: -6.6, w: 1.2, h: 3.0, r: -0.26 },
  { x: 6.0, z: -8.4, w: 2.1, h: 5.4, r: 0.12 },
] as const;

export class SceneEngine {
  private readonly opts: SceneEngineOptions;
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  private readonly material: MeshStandardMaterial;
  private readonly sculpture: Mesh;
  private readonly shadow: Mesh;
  private readonly panels: InstancedMesh;
  private readonly grid: LineSegments;
  private readonly hemi: HemisphereLight;
  private readonly key: DirectionalLight;
  private readonly rim: DirectionalLight;
  private readonly disposables: { dispose: () => void }[] = [];
  private readonly envTexture: Texture;

  private readonly ambient: boolean;
  private readonly interactive: boolean;
  private palette: LivePalette;
  private paletteTarget: LivePalette;

  private readonly state: ChapterState = cloneState(CHAPTER_STATES.top);
  private readonly target: ChapterState = cloneState(CHAPTER_STATES.top);
  private readonly pos = { x: 0, y: 0, scale: 1, floor: -1.2 };
  private readonly posTarget = { x: 0, y: 0, scale: 1, floor: -1.2 };
  private readonly pointer = { x: 0, y: 0, tx: 0, ty: 0, clientX: -1, clientY: -1 };
  private hover = 0;
  private hoverTarget = 0;
  private ambientTime = 0;

  private width = 0;
  private height = 0;
  private dpr = 1;
  private raf = 0;
  private lastTime = 0;
  private firstFrame = true;
  private disposed = false;
  private sectionTops: number[] = [];
  private documentHeight = 0;
  private anchors: (HTMLElement | null)[] = [];
  private slowFrames = 0;
  private frameSamples = 0;

  private readonly tmpObject = new Object3D();

  constructor(opts: SceneEngineOptions) {
    this.opts = opts;
    const tier = TIERS[opts.tier];
    this.ambient = opts.finePointer && !opts.reducedMotion && opts.tier !== 'low';
    this.interactive = opts.finePointer && !opts.reducedMotion;

    this.renderer = new WebGLRenderer({
      antialias: tier.antialias,
      alpha: true,
      powerPreference: opts.finePointer ? 'high-performance' : 'default',
      failIfMajorPerformanceCaveat: !opts.forced,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = NoToneMapping;
    this.dpr = Math.min(window.devicePixelRatio || 1, tier.maxDpr);
    this.renderer.setPixelRatio(this.dpr);
    const canvas = this.renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.addEventListener('webglcontextlost', this.onContextLost, false);
    opts.container.appendChild(canvas);

    this.palette = toLivePalette(PALETTES[opts.theme]);
    this.paletteTarget = toLivePalette(PALETTES[opts.theme]);

    // Image-based lighting from a procedural room: soft, believable reflections, no downloads.
    const pmrem = new PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.envTexture = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    this.scene.environment = this.envTexture;
    this.disposables.push(this.envTexture);

    this.scene.fog = new Fog(this.palette.fog, this.palette.fogNear, this.palette.fogFar);

    // Lights
    this.hemi = new HemisphereLight(this.palette.hemiSky, this.palette.hemiGround, this.palette.hemiIntensity);
    this.key = new DirectionalLight(this.palette.key, this.palette.keyIntensity);
    this.key.position.set(-4, 6, 5);
    this.rim = new DirectionalLight(this.palette.rim, this.palette.rimIntensity);
    this.rim.position.set(3.5, 2.5, -6);
    this.scene.add(this.hemi, this.key, this.rim);

    // Sculpture
    const grain = createGrainTexture();
    this.disposables.push(grain);
    const { geometry, dispose } = createSculptureGeometry(tier.segments, tier.rings);
    this.disposables.push({ dispose });
    this.material = new MeshStandardMaterial({
      color: this.palette.stone,
      roughness: this.palette.roughness,
      metalness: 0,
      roughnessMap: grain,
      bumpMap: grain,
      bumpScale: 0.22,
      envMapIntensity: this.palette.envIntensity,
    });
    this.disposables.push(this.material);
    this.sculpture = new Mesh(geometry, this.material);
    this.sculpture.frustumCulled = false;
    this.sculpture.morphTargetInfluences = [0, 0, 0];
    this.scene.add(this.sculpture);

    // Soft contact shadow — a gradient decal, far cheaper than shadow maps.
    const shadowTexture = createRadialTexture();
    const shadowMaterial = new MeshBasicMaterial({
      map: shadowTexture,
      color: this.palette.shadow,
      transparent: true,
      depthWrite: false,
      opacity: this.palette.shadowOpacity,
      fog: false,
    });
    const shadowGeometry = new PlaneGeometry(1, 1);
    this.shadow = new Mesh(shadowGeometry, shadowMaterial);
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.renderOrder = -1;
    this.scene.add(this.shadow);
    this.disposables.push(shadowTexture, shadowMaterial, shadowGeometry);

    // Architectural panels (one draw call)
    const panelGeometry = new BoxGeometry(1, 1, 1);
    const panelMaterial = new MeshStandardMaterial({
      color: this.palette.panel,
      roughness: 0.9,
      metalness: 0,
      envMapIntensity: 0.12,
    });
    this.panels = new InstancedMesh(panelGeometry, panelMaterial, PANELS.length);
    this.panels.frustumCulled = false;
    this.scene.add(this.panels);
    this.disposables.push(panelGeometry, panelMaterial);

    // Floor grid — a faint architectural plan that fades into the fog.
    const gridGeometry = createGridGeometry();
    const gridMaterial = new LineBasicMaterial({
      color: this.palette.grid,
      transparent: true,
      opacity: this.palette.gridOpacity,
      depthWrite: false,
    });
    this.grid = new LineSegments(gridGeometry, gridMaterial);
    this.grid.frustumCulled = false;
    this.scene.add(this.grid);
    this.disposables.push(gridGeometry, gridMaterial);

    this.resize(true);
    this.measure();
    this.snapToTarget();
    this.bind();
  }

  /** Compile shaders off the main thread where supported, then render the first frame. */
  async start(): Promise<void> {
    try {
      await this.renderer.compileAsync(this.scene, this.camera);
    } catch {
      // compileAsync is an optimisation; rendering compiles synchronously if it fails.
    }
    if (this.disposed) return;
    this.requestFrame();
  }

  /** Snapshot of the animated state, for debugging and automated checks. */
  debugState() {
    return {
      morph: [...(this.sculpture.morphTargetInfluences ?? [])],
      target: [...this.target.morph],
      running: this.raf !== 0,
      dpr: this.dpr,
    };
  }

  setTheme(theme: Theme): void {
    this.paletteTarget = toLivePalette(PALETTES[theme]);
    if (this.opts.reducedMotion) this.palette = toLivePalette(PALETTES[theme]);
    this.requestFrame();
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.unbind();
    for (const item of this.disposables) item.dispose();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // ------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------

  private bind() {
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    if (!this.opts.reducedMotion) window.addEventListener('scroll', this.onScroll, { passive: true });
    if (this.interactive) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', this.onPointerLeave);
    }
    if ('ResizeObserver' in window) {
      this.layoutObserver = new ResizeObserver(this.onLayoutChange);
      this.layoutObserver.observe(document.body);
    }
  }

  private layoutObserver: ResizeObserver | null = null;

  private unbind() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('pointermove', this.onPointerMove);
    document.documentElement.removeEventListener('pointerleave', this.onPointerLeave);
    this.layoutObserver?.disconnect();
  }

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.opts.onFailure('context-lost');
  };

  private onResize = () => {
    this.resize(false);
    this.measure();
    this.requestFrame();
  };

  private onLayoutChange = () => {
    this.measure();
    this.requestFrame();
  };

  private onScroll = () => this.requestFrame();

  private onVisibility = () => {
    if (!document.hidden) {
      this.lastTime = 0;
      this.requestFrame();
    }
  };

  private onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    this.pointer.clientX = event.clientX;
    this.pointer.clientY = event.clientY;
    this.pointer.tx = (event.clientX / this.width) * 2 - 1;
    this.pointer.ty = -((event.clientY / this.height) * 2 - 1);
    this.requestFrame();
  };

  private onPointerLeave = () => {
    this.pointer.tx = 0;
    this.pointer.ty = 0;
    this.pointer.clientX = -1;
    this.requestFrame();
  };

  // ------------------------------------------------------------------
  // Layout
  // ------------------------------------------------------------------

  private resize(force: boolean) {
    const rect = this.opts.container.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    // Mobile browser chrome changes the height while scrolling; ignore small changes
    // instead of reallocating the drawing buffer on every scroll.
    if (!force && width === this.width && Math.abs(height - this.height) < 120) return;
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private measure() {
    const scrollY = window.scrollY;
    this.documentHeight = document.documentElement.scrollHeight;
    this.sectionTops = CHAPTERS.map((id) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + scrollY : 0;
    });
    this.anchors = CHAPTERS.map(
      (id) => document.getElementById(id)?.querySelector<HTMLElement>('[data-scene-anchor]') ?? null
    );
  }

  /** Where a chapter's anchor sits in the viewport right now (fractions of the viewport). */
  private placement(chapter: number, out: Placement): Placement {
    const anchor = this.anchors[chapter];
    if (!anchor) {
      out.cx = 0.72;
      out.cy = 0.5;
      out.size = 0.5;
      return out;
    }
    const rect = anchor.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      // The layout hides this anchor (e.g. on small screens): let the sculpture drift up and out of view.
      out.cx = 0.78;
      out.cy = -0.45;
      out.size = 0.32;
      return out;
    }
    // In the static (reduced-motion) layout the canvas scrolls with the page, so use document coordinates.
    const offsetY = this.opts.reducedMotion ? window.scrollY : 0;
    const viewportH = this.opts.reducedMotion ? this.height : window.innerHeight;
    out.cx = (rect.left + rect.width / 2) / this.width;
    out.cy = (rect.top + offsetY + rect.height / 2) / viewportH;
    out.size = Math.min(rect.height, rect.width * 1.1) / viewportH;
    return out;
  }

  private readonly placeA: Placement = { cx: 0, cy: 0, size: 0 };
  private readonly placeB: Placement = { cx: 0, cy: 0, size: 0 };

  // ------------------------------------------------------------------
  // Frame loop
  // ------------------------------------------------------------------

  private requestFrame = () => {
    if (this.raf || this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
  };

  private computeTarget() {
    const reduced = this.opts.reducedMotion;
    const progress = reduced
      ? 0
      : chapterProgress(
          this.sectionTops,
          window.scrollY,
          window.innerHeight,
          this.documentHeight
        );
    const last = CHAPTERS.length - 1;
    const index = Math.min(last - 1, Math.max(0, Math.floor(progress)));
    const t = Math.min(1, Math.max(0, progress - index));

    blendStates(CHAPTER_STATES[CHAPTERS[index]], CHAPTER_STATES[CHAPTERS[index + 1]], t, this.target);

    const a = this.placement(index, this.placeA);
    const b = t > 0 ? this.placement(index + 1, this.placeB) : a;
    const cx = lerp(a.cx, b.cx, t);
    const cy = lerp(a.cy, b.cy, t);
    const size = lerp(a.size, b.size, t);

    const halfH = Math.tan(MathUtils.degToRad(FOV / 2)) * this.target.dolly;
    const halfW = halfH * this.camera.aspect;
    this.posTarget.x = (cx - 0.5) * 2 * halfW;
    this.posTarget.y = (0.5 - cy) * 2 * halfH;
    this.posTarget.scale = Math.max(0.2, ((size * 2 * halfH) / OBJECT_HEIGHT) * this.target.scale);
    this.posTarget.floor = this.posTarget.y - 1.08 * this.posTarget.scale;

    // Hover: is the pointer over the sculpture's projected silhouette?
    if (this.interactive && this.pointer.clientX >= 0) {
      const sx = cx * this.width;
      const sy = cy * this.height;
      const radius = ((size * this.height) / 2) * 0.8;
      this.hoverTarget = Math.hypot(this.pointer.clientX - sx, this.pointer.clientY - sy) < radius ? 1 : 0;
    } else {
      this.hoverTarget = 0;
    }
  }

  private snapToTarget() {
    this.computeTarget();
    Object.assign(this.state, cloneState(this.target));
    Object.assign(this.pos, this.posTarget);
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.disposed) return;
    const dt = this.lastTime ? Math.min(0.1, (now - this.lastTime) / 1000) : 1 / 60;
    this.lastTime = now;

    this.computeTarget();
    const reduced = this.opts.reducedMotion;
    const k = reduced ? Infinity : 2.8;
    let delta = 0;
    const step = (current: number, target: number, lambda = k) => {
      const next = damp(current, target, lambda, dt);
      delta = Math.max(delta, Math.abs(target - next));
      return next;
    };

    const s = this.state;
    const tg = this.target;
    s.morph[0] = step(s.morph[0], tg.morph[0]);
    s.morph[1] = step(s.morph[1], tg.morph[1]);
    s.morph[2] = step(s.morph[2], tg.morph[2]);
    s.rotX = step(s.rotX, tg.rotX);
    s.rotY = step(s.rotY, tg.rotY);
    s.rotZ = step(s.rotZ, tg.rotZ);
    s.dolly = step(s.dolly, tg.dolly);
    s.spread = step(s.spread, tg.spread);
    s.sink = step(s.sink, tg.sink);
    s.grid = step(s.grid, tg.grid);
    s.structure = step(s.structure, tg.structure);
    s.scale = step(s.scale, tg.scale);
    // Position follows a little faster so the object keeps up with its anchor while scrolling.
    this.pos.x = step(this.pos.x, this.posTarget.x, reduced ? Infinity : 4.5);
    this.pos.y = step(this.pos.y, this.posTarget.y, reduced ? Infinity : 4.5);
    this.pos.scale = step(this.pos.scale, this.posTarget.scale, reduced ? Infinity : 4.5);
    this.pos.floor = step(this.pos.floor, this.posTarget.floor, reduced ? Infinity : 4.5);
    this.pointer.x = step(this.pointer.x, this.pointer.tx, 3.2);
    this.pointer.y = step(this.pointer.y, this.pointer.ty, 3.2);
    this.hover = step(this.hover, this.hoverTarget, 4);

    delta = Math.max(delta, this.stepPalette(dt, reduced ? Infinity : 4));

    if (this.ambient) this.ambientTime += dt;

    this.apply();
    this.renderer.render(this.scene, this.camera);

    if (this.firstFrame) {
      this.firstFrame = false;
      this.opts.onReady();
    }

    const continuing = this.ambient || delta > SETTLE_EPSILON;
    if (continuing && !reduced) {
      this.trackPerformance(dt);
      this.requestFrame();
    }
  };

  private stepPalette(dt: number, lambda: number): number {
    const t = lambda === Infinity ? 1 : 1 - Math.exp(-lambda * dt);
    let delta = 0;
    for (const key of PALETTE_COLOR_KEYS) {
      const current = this.palette[key];
      const target = this.paletteTarget[key];
      delta = Math.max(delta, Math.abs(current.r - target.r), Math.abs(current.g - target.g), Math.abs(current.b - target.b));
      current.lerp(target, t);
    }
    for (const key of PALETTE_NUMBER_KEYS) {
      const current = this.palette[key];
      const target = this.paletteTarget[key];
      delta = Math.max(delta, Math.abs(target - current) * 0.1);
      this.palette[key] = lerp(current, target, t);
    }
    return delta;
  }

  private apply() {
    const s = this.state;
    const p = this.palette;
    const px = this.pointer.x;
    const py = this.pointer.y;
    const hover = this.hover;

    // Camera: gentle parallax against the pointer.
    this.camera.position.set(px * 0.32, 0.12 + py * 0.18, s.dolly);
    this.camera.lookAt(px * 0.08, py * 0.04, 0);

    // Sculpture
    const influences = this.sculpture.morphTargetInfluences!;
    influences[MORPH.stack] = s.morph[0];
    influences[MORPH.exploded] = s.morph[1];
    influences[MORPH.calm] = s.morph[2];

    const bob = this.ambient ? Math.sin(this.ambientTime * 0.7) * 0.035 : 0;
    const scale = this.pos.scale * s.scale * (1 + hover * 0.025);
    this.sculpture.position.set(this.pos.x, this.pos.y + bob * this.pos.scale, 0);
    this.sculpture.scale.setScalar(scale);
    this.sculpture.rotation.set(
      s.rotX - py * 0.16 * (1 + hover * 0.8),
      s.rotY + this.ambientTime * 0.07 + px * 0.42 * (1 + hover * 0.6),
      s.rotZ
    );

    this.material.color.copy(p.stone).lerp(p.structured, s.structure);
    this.material.roughness = p.roughness - s.structure * 0.12;
    this.material.envMapIntensity = p.envIntensity * (1 + hover * 0.6);

    // Lights: the key light leans toward the pointer; hover brightens the rim.
    this.key.color.copy(p.key);
    this.key.intensity = p.keyIntensity * (1 + hover * 0.18);
    this.key.position.set(-4 + px * 2.5, 6 + py * 1.5, 5);
    this.rim.color.copy(p.rim);
    this.rim.intensity = p.rimIntensity * (1 + hover * 0.5);
    this.hemi.color.copy(p.hemiSky);
    this.hemi.groundColor.copy(p.hemiGround);
    this.hemi.intensity = p.hemiIntensity;

    const fog = this.scene.fog as Fog;
    fog.color.copy(p.fog);
    fog.near = p.fogNear;
    fog.far = p.fogFar;

    // Contact shadow
    const floor = this.pos.floor;
    const shadowMaterial = this.shadow.material as MeshBasicMaterial;
    shadowMaterial.color.copy(p.shadow);
    const lift = Math.max(0, bob);
    shadowMaterial.opacity = p.shadowOpacity * (1 - s.morph[1] * 0.35) * (1 - lift * 4);
    this.shadow.position.set(this.pos.x, floor + 0.002, 0.1);
    this.shadow.scale.set(3.3 * scale, 2.3 * scale, 1);

    // Panels
    const panelMaterial = this.panels.material as MeshStandardMaterial;
    panelMaterial.color.copy(p.panel);
    for (let i = 0; i < PANELS.length; i++) {
      const panel = PANELS[i];
      const sink = s.sink * (0.55 + i * 0.12);
      this.tmpObject.position.set(panel.x * s.spread + this.pos.x * 0.25, floor + panel.h / 2 - sink, panel.z);
      this.tmpObject.rotation.set(0, panel.r * s.spread, 0);
      this.tmpObject.scale.set(panel.w, panel.h, 0.06);
      this.tmpObject.updateMatrix();
      this.panels.setMatrixAt(i, this.tmpObject.matrix);
    }
    this.panels.instanceMatrix.needsUpdate = true;

    // Grid
    const gridMaterial = this.grid.material as LineBasicMaterial;
    gridMaterial.color.copy(p.grid);
    gridMaterial.opacity = p.gridOpacity * s.grid;
    this.grid.position.set(this.pos.x * 0.25, floor, 0);
    this.grid.visible = gridMaterial.opacity > 0.002;
  }

  /** Lower the resolution if frames are consistently slow; responsiveness beats sharpness. */
  private trackPerformance(dt: number) {
    this.frameSamples++;
    if (dt > 1 / 42) this.slowFrames++;
    if (this.frameSamples < 90) return;
    const slowShare = this.slowFrames / this.frameSamples;
    this.frameSamples = 0;
    this.slowFrames = 0;
    if (slowShare > 0.35 && this.dpr > 1) {
      this.dpr = Math.max(1, this.dpr - 0.25);
      this.renderer.setPixelRatio(this.dpr);
      this.renderer.setSize(this.width, this.height, false);
    }
  }
}

function createGrainTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(size, size);
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
      const value = Math.round(MathUtils.clamp(0.86 + n * 0.14, 0, 1) * 255);
      const o = (y * size + x) * 4;
      image.data[o] = value;
      image.data[o + 1] = value;
      image.data[o + 2] = value;
      image.data[o + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(5, 3);
  return texture;
}

function createRadialTexture(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.45)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

function createGridGeometry(): BufferGeometry {
  const positions: number[] = [];
  const step = 0.9;
  const minX = -14;
  const maxX = 14;
  const minZ = -16;
  const maxZ = 4;
  for (let x = minX; x <= maxX + 0.001; x += step) positions.push(x, 0, minZ, x, 0, maxZ);
  for (let z = minZ; z <= maxZ + 0.001; z += step) positions.push(minX, 0, z, maxX, 0, z);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  return geometry;
}

export function createSceneEngine(opts: SceneEngineOptions): SceneEngine {
  return new SceneEngine(opts);
}
