# stansmits.nl

Personal portfolio of Stan Smits — a single-page, scroll-choreographed 3D experience
with real HTML content underneath, plus a few small tools (`/tools`).

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| App | React 18 + TypeScript + Vite 5 | Existing stack; fast static build, no server rendering needed |
| Styling | Tailwind CSS 3 + CSS custom properties | Semantic theme tokens in `src/index.css`, mapped into Tailwind |
| 3D | three.js (vanilla, lazy-loaded) | One scene with an imperative render loop; no React re-renders per frame |
| Motion | CSS transitions + a small custom scroll/damping controller | No animation library needed for this choreography |
| i18n | i18next (NL default, EN) | Existing setup, kept |
| Hosting | Cloudflare Pages (static build + one Pages Function) | Existing host |
| Contact | Pages Function → Resend HTTP API | Keeps API keys server-side |

## Scripts

```bash
npm install
npm run dev        # http://localhost:3000 (contact endpoint served by a Vite middleware)
npm run typecheck  # app + node/serverless code
npm run lint
npm test           # contact endpoint + validation tests (node:test)
npm run build      # typecheck + production build to dist/
npm run preview    # serve dist/ locally (also serves /api/contact)
```

## Architecture

```
src/
  content/            Typed content: profile, projects (EN/NL), experience & education
  components/
    layout/           Header (nav, mobile menu), footer, router scroll handling
    sections/         Hero, Work, About, Experience, Contact
    work/             Project cards, featured project, case-study dialog, illustrations
    contact/          Contact form (shared validation with the server)
    scene/            React wrapper around the 3D engine + layout anchors + CSS fallback
  scene/              three.js engine (lazy chunk), choreography, palettes, worker
  theme/              Theme provider (system preference + persisted choice)
  i18n/               Translations for UI strings
server/contact.ts     Contact handler (Web Request/Response API, platform-agnostic)
functions/api/        Cloudflare Pages Function adapter for /api/contact
tests/                Node test-runner tests for the contact handler
```

### The 3D scene

- **One sculpture, four layouts.** `src/scene/shapes.ts` builds a sphere-topology mesh and
  four vertex layouts that share one index buffer — stone, slab stack, exploded stack and a
  calm pebble. The engine blends them with three.js morph targets (positions *and* normals),
  so the transitions are genuine geometry interpolation.
- **Layout decides placement.** Each section contains a `[data-scene-anchor]` element; the
  engine reads the anchors' positions, so the responsive layout — not hard-coded numbers —
  keeps the object clear of text at every breakpoint.
- **Scroll choreography.** `src/scene/choreography.ts` defines a target state per section
  (morph weights, rotation, camera distance, environment). Scroll position blends neighbouring
  states; every value then eases toward its target. The document scrolls natively.
- **Performance.** The three.js chunk loads only when the browser is idle. Geometry and
  texture data are generated in a Web Worker. Rendering is demand-driven: on touch devices the
  scene renders only while something is changing; on desktop a slow idle rotation runs until
  frames prove expensive, at which point resolution drops and the idle loop stops. Image-based
  lighting is reserved for the high quality tier.
- **Fallbacks.** No WebGL, a software renderer, a context loss or a 9 s timeout → a static
  CSS sculpture. `prefers-reduced-motion` → one still composition that scrolls away with the
  hero. Add `?scene=force` to the URL to force WebGL (useful for testing in headless browsers).

## Contact form configuration

The form posts to `/api/contact`. Without configuration the endpoint answers `503` and the
form tells visitors to email directly — it never pretends a message was sent.

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key (server-side only; never prefix with `VITE_`) |
| `CONTACT_FROM_EMAIL` | yes | Sender on a domain verified in Resend, e.g. `Portfolio <portfolio@stansmits.nl>` |
| `CONTACT_TO_EMAIL` | no | Defaults to `connect@stansmits.nl` |
| `CONTACT_ALLOWED_ORIGINS` | no | Extra comma-separated origins (e.g. preview deployments) |
| `CONTACT_DRY_RUN` | no | Local dev/preview only: `1` validates without sending |

Spam protection: honeypot field, minimum fill time, per-instance rate limiting, origin check,
body size limit, server-side validation and plain-text email only.

## Deployment

The site deploys on **Cloudflare Pages** (build command `npm run build`, output `dist/`).

- `functions/api/contact.ts` is picked up automatically as a Pages Function for
  `/api/contact`; `public/_routes.json` limits function invocations to `/api/*`.
- Set the contact variables above under *Settings → Environment variables* of the Pages
  project (mark `RESEND_API_KEY` as a secret), for Production and, if wanted, Preview.
- `public/_headers` adds security headers and long-lived caching for hashed assets.
- Client-side routes such as `/tools/tod` work through Pages' single-page-app fallback
  (there is deliberately no top-level `404.html`).
- On another host: serve `dist/` with a fallback to `index.html`, and run
  `handleContactRequest` from `server/contact.ts` in that platform's function runtime.

`public/robots.txt`, `public/sitemap.xml`, favicons, the web manifest and the social preview
image (`public/og-image.jpg`) are copied to the build output as-is.

## Fonts

Syne and Manrope (SIL Open Font License, see `public/fonts/`), self-hosted, latin subsets.
