import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';

const backend = await import('../server.mjs').catch(error => {
  if (error.code === 'ERR_MODULE_NOT_FOUND' && error.message.includes('server.mjs')) return {};
  throw error;
});
const fields = { name: 'Ada Example', email: 'ada@example.com', message: 'Please tell me about your services.', source: '/contact', website: '' };
async function fixture(t, options = {}) {
  assert.equal(typeof backend.createServer, 'function', 'server exports configurable createServer');
  const dir = await mkdtemp(path.join(process.env.TMPDIR || process.cwd(), 'vyoium-enquiry-'));
  const distDir = path.join(dir, 'dist');
  await mkdir(distDir);
  const server = backend.createServer({ distDir, dataDir: path.join(dir, 'data'), env: {RATE_LIMIT:'100',...options.env}, ...Object.fromEntries(Object.entries(options).filter(([key])=>key!=='env')) });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }); await rm(dir, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${server.address().port}`;
  return { server, dir, distDir, base, post: (body = fields, headers = {}) => fetch(base + '/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) }) };
}

test('invalid JSON or enquiry fields are rejected before delivery', async t => {
  const f = await fixture(t);
  for (const body of ['{bad', null, [], { ...fields, name: '' }, { ...fields, name: 'x'.repeat(121) }, { ...fields, email: 'bad' }, { ...fields, email: 'x'.repeat(255) + '@example.com' }, { ...fields, message: '' }, { ...fields, message: 'x'.repeat(5001) }, { ...fields, source: 'x'.repeat(501) }, { ...fields, name: ['Ada'] }, { ...fields, email: 'ada@example.com\r\nBcc: bad@example.com' }]) {
    const response = await f.post(body);
    assert.equal(response.status, 400);
    assert.equal((await response.json()).ok, false);
  }
});

const smtpEnv = { SMTP_HOST: 'smtp.example.com', SMTP_PORT: '587', SMTP_USER: 'user', SMTP_PASS: 'test-only', SMTP_FROM: 'website@example.com', ENQUIRY_TO: 'owner@example.com' };

test('JSON success requires accepted delivery by injected test transport, not a live inbox', async t => {
  const deliveries = [];
  const f = await fixture(t, { env: smtpEnv, transport: { async sendMail(mail) { deliveries.push(mail); return { accepted: ['owner@example.com'], rejected: [] }; } } });
  const response = await f.post();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(deliveries.length, 1);
  assert.equal(deliveries[0].from, smtpEnv.SMTP_FROM);
  assert.equal(deliveries[0].to, smtpEnv.ENQUIRY_TO);
  assert.equal(deliveries[0].replyTo, fields.email);
  assert.match(deliveries[0].text, /Ada Example/);
  assert.match(deliveries[0].text, /\/contact/);
  assert.equal(deliveries[0].disableFileAccess, true);
  assert.equal(deliveries[0].disableUrlAccess, true);
  for (const outcome of ['throw', 'reject', 'empty']) {
    const bad = await fixture(t, { env: smtpEnv, transport: { async sendMail() { if (outcome === 'throw') throw new Error('secret SMTP failure'); return { accepted: outcome === 'empty' ? [] : ['owner@example.com'], rejected: outcome === 'reject' ? ['owner@example.com'] : [] }; } } });
    const result = await bad.post();
    assert.equal(result.status, 503);
    const text = await result.text();
    assert.match(text, /"ok":false/);
    assert.doesNotMatch(text, /secret SMTP/);
  }
});

test('configured nodemailer delivers through a local SMTP test server (not a live inbox)', async t => {
  let received = '';
  const sockets = new Set();
  const smtp = net.createServer(socket => {
    sockets.add(socket); socket.on('close', () => sockets.delete(socket));
    socket.write('220 localhost test SMTP\r\n');
    let buffer = '', inData = false;
    socket.on('data', chunk => {
      buffer += chunk.toString();
      while (buffer.includes('\r\n')) {
        const end = buffer.indexOf('\r\n'), line = buffer.slice(0, end); buffer = buffer.slice(end + 2);
        if (inData) { if (line === '.') { inData = false; socket.write('250 queued for test\r\n'); } else received += line + '\n'; }
        else if (/^EHLO/.test(line)) socket.write('250-localhost\r\n250 AUTH PLAIN\r\n');
        else if (/^AUTH/.test(line)) socket.write('235 authenticated\r\n');
        else if (line === 'DATA') { inData = true; socket.write('354 send data\r\n'); }
        else if (line === 'QUIT') socket.end('221 bye\r\n');
        else socket.write('250 OK\r\n');
      }
    });
  });
  await new Promise(resolve => smtp.listen(0, '127.0.0.1', resolve));
  t.after(async () => { for (const socket of sockets) socket.destroy(); await new Promise(resolve => smtp.close(resolve)); });
  const f = await fixture(t, { env: { ...smtpEnv, SMTP_HOST: '127.0.0.1', SMTP_PORT: String(smtp.address().port), SMTP_REQUIRE_TLS: 'false' } });
  assert.equal((await f.post()).status, 200);
  assert.match(received, /Reply-To: ada@example.com/);
  assert.match(received, /Please tell me about your services/);
});

test('invalid SMTP configuration cannot succeed even with injected transport', async t => {
  for (const env of [{}, { ...smtpEnv, SMTP_PORT: 'not-a-port' }, { ...smtpEnv, SMTP_FROM: 'bad\r\nBcc: bad@example.com' }]) {
    let calls = 0;
    const f = await fixture(t, { env, transport: { async sendMail() { calls++; return { accepted: [env.ENQUIRY_TO], rejected: [] }; } } });
    assert.equal((await f.post()).status, 503);
    assert.equal(calls, 0);
  }
});

test('native HTML failures retain escaped bounded fields and accessible retry form', async t => {
  const f = await fixture(t);
  for (const [input, status] of [[{ ...fields, name: 'Ada <script>alert(1)</script>', message: '<img src=x onerror=alert(1)> & "text"' }, 503], [{ ...fields, name: '\"><script>bad</script>' + 'x'.repeat(130), email: 'bad', message: 'x'.repeat(5100) }, 400]]) {
    const response = await f.post(new URLSearchParams(input).toString(), { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' });
    assert.equal(response.status, status);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    assert.match(html, /method="post" action="\/api\/enquiry"/);
    assert.match(html, /name="name"[^>]+maxlength="120"/);
    assert.match(html, /name="email"[^>]+maxlength="254"/);
    assert.match(html, /name="message"[^>]+maxlength="5000"/);
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>|<img src=x/);
    assert.match(html, /role="alert"/);
    assert.match(html, /name="source"[^>]+value="\/contact"/);
    const value = html.match(/<textarea[^>]*>(.*?)<\/textarea>/s)[1];
    assert.ok(value.length <= 5100);
  }
});

test('native HTML success contains receipt only after delivery', async t => {
  const f = await fixture(t, { env: smtpEnv, transport: { async sendMail() { return { accepted: ['owner@example.com'], rejected: [] }; } } });
  const response = await f.post(new URLSearchParams(fields).toString(), { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Your enquiry has been sent/);
});

test('body size is bounded in bytes for JSON and URL-encoded requests', async t => {
  const f = await fixture(t);
  for (const [body, type] of [['x'.repeat(32769), 'application/json'], [new URLSearchParams({ ...fields, message: '😀'.repeat(4000) }).toString(), 'application/x-www-form-urlencoded']]) {
    const response = await f.post(body, { 'Content-Type': type });
    assert.equal(response.status, 413);
    assert.equal((await response.json()).ok, false);
  }
});

test('unsupported request media type is rejected', async t => {
  const f = await fixture(t);
  assert.equal((await f.post(fields, { 'Content-Type': 'text/plain' })).status, 415);
});

test('honeypot blocks delivery without pretending success', async t => {
  let calls = 0;
  const f = await fixture(t, { env: smtpEnv, transport: { async sendMail() { calls++; return { accepted: ['owner@example.com'], rejected: [] }; } } });
  const response = await f.post({ ...fields, website: 'spam.example.com' });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).ok, false);
  assert.equal(calls, 0);
});

test('configured SITE_URL rejects foreign origins and cross-site fetches, accepts native same-site requests', async t => {
  const f = await fixture(t, { env: { SITE_URL: 'https://vyoium.example' } });
  for (const headers of [{ Origin: 'https://evil.example' }, { Origin: 'null' }, { 'Sec-Fetch-Site': 'cross-site' }, { Origin: 'https://vyoium.example.evil.example' }]) assert.equal((await f.post(fields, headers)).status, 403);
  assert.equal((await f.post(fields, { Origin: 'https://vyoium.example' })).status, 503);
  assert.equal((await f.post()).status, 503);
  const local = await fixture(t);
  assert.equal((await local.post(fields, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await local.post(fields, { Origin: local.base })).status, 503);
});

test('unconfigured SMTP returns honest 503 over real HTTP', async t => {
  const f = await fixture(t);
  const response = await f.post();
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.ok, false);
  assert.match(result.message, /not configured|unavailable/i);
});
