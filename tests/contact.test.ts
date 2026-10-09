import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as server from '../api/contact.ts';
import * as client from '../src/lib/contactValidation.ts';

const valid = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello there, nice portfolio!', elapsedMs: 5000 };
const env = { RESEND_API_KEY: 're_test', CONTACT_FROM_EMAIL: 'Portfolio <portfolio@stansmits.nl>' };

function request(body: unknown, init: { headers?: Record<string, string>; method?: string } = {}) {
  return new Request('https://stansmits.nl/api/contact', {
    method: init.method ?? 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://stansmits.nl', ...init.headers },
    body: init.method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function recordingFetch(status = 200) {
  const calls: { url: string; body: Record<string, unknown>; headers: Headers }[] = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init.body)), headers: new Headers(init.headers) });
    return new Response('{}', { status });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

test('client and server validation stay identical', () => {
  assert.deepEqual(server.CONTACT_LIMITS, client.CONTACT_LIMITS);
  const cases = [
    { name: '', email: '', message: '' },
    { name: 'A', email: 'not-an-email', message: 'short' },
    { name: 'x'.repeat(101), email: `${'a'.repeat(250)}@b.nl`, message: 'y'.repeat(5001) },
    { name: '  Stan\u0007 ', email: ' Stan@Example.COM ', message: 'Line one\r\nLine two\u0000 ok' },
    valid,
  ];
  for (const raw of cases) {
    const a = server.normaliseContactInput(raw);
    const b = client.normaliseContactInput(raw);
    assert.deepEqual(a, b);
    assert.deepEqual(server.validateContact(a), client.validateContact(b));
  }
});

test('normalisation trims, lowercases email and strips control characters', () => {
  const input = server.normaliseContactInput({ name: '  Stan\u0007 ', email: ' Stan@Example.COM ', message: 'a\r\nb\u0000c' });
  assert.equal(input.name, 'Stan');
  assert.equal(input.email, 'stan@example.com');
  assert.equal(input.message, 'a\nbc');
});

test('rejects non-POST, wrong content type, foreign origins and bad JSON', async () => {
  const opts = { env, fetchImpl: recordingFetch().fetchImpl };
  assert.equal((await server.handleContactRequest(request(null, { method: 'GET' }), opts)).status, 405);
  assert.equal((await server.handleContactRequest(request(valid, { headers: { 'content-type': 'text/plain' } }), opts)).status, 415);
  assert.equal((await server.handleContactRequest(request(valid, { headers: { origin: 'https://evil.example' } }), opts)).status, 403);
  assert.equal((await server.handleContactRequest(request('{nope'), opts)).status, 400);
  assert.equal((await server.handleContactRequest(request('x'.repeat(30_000)), opts)).status, 413);
});

test('returns field errors for invalid input', async () => {
  const res = await server.handleContactRequest(request({ ...valid, email: 'nope', message: 'hi' }), {
    env,
    fetchImpl: recordingFetch().fetchImpl,
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.deepEqual(body.errors, { email: 'emailInvalid', message: 'messageShort' });
});

test('reports missing configuration honestly instead of pretending to send', async () => {
  const { calls, fetchImpl } = recordingFetch();
  const res = await server.handleContactRequest(request(valid), { env: {}, fetchImpl, limiter: new server.RateLimiter() });
  assert.equal(res.status, 503);
  assert.equal(calls.length, 0);
});

test('sends a plain-text email through Resend with reply-to set to the visitor', async () => {
  const { calls, fetchImpl } = recordingFetch();
  const res = await server.handleContactRequest(request({ ...valid, message: '<b>hi</b> there, friend' }), {
    env: { ...env, CONTACT_TO_EMAIL: 'inbox@stansmits.nl' },
    fetchImpl,
    limiter: new server.RateLimiter(),
  });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].headers.get('authorization'), 'Bearer re_test');
  assert.deepEqual(calls[0].body.to, ['inbox@stansmits.nl']);
  assert.equal(calls[0].body.reply_to, 'ada@example.com');
  assert.equal(calls[0].body.html, undefined, 'never sends HTML built from user input');
  assert.match(String(calls[0].body.text), /<b>hi<\/b> there/);
});

test('surfaces provider failures as 502', async () => {
  const res = await server.handleContactRequest(request(valid), {
    env,
    fetchImpl: recordingFetch(500).fetchImpl,
    limiter: new server.RateLimiter(),
  });
  assert.equal(res.status, 502);
});

test('silently drops honeypot and too-fast submissions without sending', async () => {
  const { calls, fetchImpl } = recordingFetch();
  const opts = { env, fetchImpl, limiter: new server.RateLimiter() };
  assert.equal((await server.handleContactRequest(request({ ...valid, company: 'Spam Inc' }), opts)).status, 200);
  assert.equal((await server.handleContactRequest(request({ ...valid, elapsedMs: 200 }), opts)).status, 200);
  assert.equal(calls.length, 0);
});

test('rate limits repeated submissions from one address', async () => {
  const limiter = new server.RateLimiter(2, 60_000);
  const opts = { env, fetchImpl: recordingFetch().fetchImpl, limiter, now: () => 1000 };
  const headers = { 'x-forwarded-for': '203.0.113.9' };
  assert.equal((await server.handleContactRequest(request(valid, { headers }), opts)).status, 200);
  assert.equal((await server.handleContactRequest(request(valid, { headers }), opts)).status, 200);
  assert.equal((await server.handleContactRequest(request(valid, { headers }), opts)).status, 429);
});
