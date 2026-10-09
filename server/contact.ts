/**
 * Contact form endpoint: POST /api/contact
 *
 * Written against the Web-standard Request/Response API so the same code runs as a
 * Cloudflare Pages Function (functions/api/contact.ts), in the Vite dev/preview servers
 * (vite.config.ts) and in Node's test runner. Email is delivered through Resend's HTTP API.
 *
 * Required environment variables (server-side only, never exposed to the client):
 *   RESEND_API_KEY       API key from https://resend.com
 *   CONTACT_FROM_EMAIL   Verified sender, e.g. "Portfolio <portfolio@stansmits.nl>"
 * Optional:
 *   CONTACT_TO_EMAIL         Recipient (defaults to connect@stansmits.nl)
 *   CONTACT_ALLOWED_ORIGINS  Extra comma-separated origins allowed to post (e.g. a preview URL)
 *
 * Validation is shared with the browser form (src/lib/contactValidation.ts).
 */

import { normaliseContactInput, validateContact } from '../src/lib/contactValidation.ts';

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
}

export interface ContactHandlerOptions {
  env: ContactEnv;
  fetchImpl?: typeof fetch;
  now?: () => number;
  limiter?: RateLimiter;
  /** Development only: validate and log instead of sending. Never set by the production adapter. */
  dryRun?: boolean;
}

const MAX_BODY_BYTES = 20_000;
/** Submissions faster than this are almost certainly automated. */
const MIN_FILL_TIME_MS = 1500;
const DEFAULT_RECIPIENT = 'connect@stansmits.nl';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });

/** Small fixed-window limiter. In serverless it is per instance — a best-effort brake, not a guarantee. */
export class RateLimiter {
  private readonly hits = new Map<string, { count: number; reset: number }>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit = 5, windowMs = 10 * 60 * 1000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  take(key: string, now: number): boolean {
    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits) if (v.reset <= now) this.hits.delete(k);
    }
    const entry = this.hits.get(key);
    if (!entry || entry.reset <= now) {
      this.hits.set(key, { count: 1, reset: now + this.windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= this.limit;
  }
}

const sharedLimiter = new RateLimiter();

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim();
}

function originAllowed(request: Request, env: ContactEnv): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // Same-origin form posts from some browsers omit Origin.
  const allowed = new Set<string>(['https://stansmits.nl', 'https://www.stansmits.nl']);
  try {
    allowed.add(new URL(request.url).origin);
  } catch {
    // ignore malformed request URL
  }
  for (const extra of (env.CONTACT_ALLOWED_ORIGINS ?? '').split(',')) {
    if (extra.trim()) allowed.add(extra.trim());
  }
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) {
    allowed.add(`https://${host}`);
    allowed.add(`http://${host}`);
  }
  return allowed.has(origin);
}

export async function handleContactRequest(request: Request, options: ContactHandlerOptions): Promise<Response> {
  const { env, fetchImpl = fetch, now = Date.now, limiter = sharedLimiter, dryRun = false } = options;

  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' }, { Allow: 'POST' });
  if (!originAllowed(request, env)) return json(403, { error: 'forbidden_origin' });
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return json(415, { error: 'unsupported_media_type' });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: 'payload_too_large' });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  // Spam signals: a filled honeypot or an implausibly fast submission. Bots get a
  // generic success so they don't adapt; a person never fills the hidden field.
  const honeypot = typeof body.company === 'string' ? body.company.trim() : '';
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : Number.POSITIVE_INFINITY;
  if (honeypot || elapsed < MIN_FILL_TIME_MS) return json(200, { ok: true });

  const input = normaliseContactInput(body);
  const errors = validateContact(input);
  if (Object.keys(errors).length) return json(400, { error: 'validation_failed', errors });

  if (!limiter.take(clientKey(request), now())) return json(429, { error: 'rate_limited' }, { 'Retry-After': '600' });

  const subject = `Portfolio message from ${input.name}`.slice(0, 160);
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Language: ${body.lang === 'en' ? 'en' : 'nl'}`,
    '',
    input.message,
  ].join('\n');

  if (dryRun) {
    console.info('[contact] dry run — message validated but not sent (%d chars).', input.message.length);
    return json(200, { ok: true, dryRun: true });
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) return json(503, { error: 'not_configured' });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetchImpl(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL || DEFAULT_RECIPIENT],
        reply_to: input.email,
        subject,
        text,
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      // Log the provider status only — never the visitor's details.
      console.error('[contact] email provider responded with status %d', response.status);
      return json(502, { error: 'send_failed' });
    }
    return json(200, { ok: true });
  } catch {
    console.error('[contact] email provider request failed');
    return json(502, { error: 'send_failed' });
  } finally {
    clearTimeout(timer);
  }
}
