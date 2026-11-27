import { test } from 'node:test';
import assert from 'node:assert/strict';
import gateway from './cv-gateway.js';

test('old hostname permanently redirects paths and queries', async () => {
  for (const [path, expected] of [['/', '/cv'], ['/polymarket/?source=cv', '/cv/polymarket/?source=cv'], ['/api/card.pdf', '/cv/api/card.pdf']]) {
    const response = await gateway.fetch(new Request('https://cv.carlosguerrero.com' + path), {});
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), 'https://carlosguerrero.com' + expected);
  }
});
test('www and trailing slash canonicalize without losing query', async () => {
  for (const url of ['https://www.carlosguerrero.com/cv?a=1', 'https://carlosguerrero.com/cv/?a=1']) {
    const response = await gateway.fetch(new Request(url), {});
    assert.equal(response.headers.get('Location'), 'https://carlosguerrero.com/cv?a=1');
  }
});
test('mount maps main, nested, and asset paths to separate W7S origin', async (t) => {
  t.mock.method(globalThis, 'fetch', async request => new Response(request.url, { headers: { 'Content-Type': 'text/plain' } }));
  for (const [path, suffix] of [['/cv', '/'], ['/cv/polymarket/?q=1', '/polymarket/?q=1'], ['/cv/_astro/style.css', '/_astro/style.css']]) {
    const response = await gateway.fetch(new Request('https://carlosguerrero.com' + path), {});
    assert.equal(await response.text(), 'https://guerrerocarlos.w7s.cloud/cv.carlosguerrero.com' + suffix);
  }
});
test('origin redirects stay within public CV mount', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.redirect('https://guerrerocarlos.w7s.cloud/cv.carlosguerrero.com/polymarket/?x=1', 301));
  const response = await gateway.fetch(new Request('https://carlosguerrero.com/cv/polymarket?x=1'), {});
  assert.equal(response.headers.get('Location'), 'https://carlosguerrero.com/cv/polymarket/?x=1');
});
test('health reports deployment metadata; unrelated paths are not proxied', async () => {
  const env = { BRANCH: 'main', COMMIT_HASH: '1234', DEPLOYED_AT: '2026-11-27T00:00:00Z' };
  const response = await gateway.fetch(new Request('https://carlosguerrero.com/cv/health'), env);
  assert.deepEqual(await response.json(), { branch: env.BRANCH, commitHash: env.COMMIT_HASH, deployedAt: env.DEPLOYED_AT });
  assert.equal((await gateway.fetch(new Request('https://carlosguerrero.com/cv-other?q=1'), env)).headers.get('Location'), 'https://www.carlosguerrero.com/cv-other?q=1');
});

test('generated PDF keeps its body and uses a browser-readable MIME type', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('%PDF-1.7', { headers: { 'Content-Type': 'application/octet-stream' } }));
  const response = await gateway.fetch(new Request('https://carlosguerrero.com/cv/api/card.pdf'), {});
  assert.equal(response.headers.get('Content-Type'), 'application/pdf');
  assert.equal(await response.text(), '%PDF-1.7');
});
