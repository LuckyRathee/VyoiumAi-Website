import { readFile, writeFile, mkdir, stat, readdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateFields, mailTransport, responseHtml } from './lib/enquiry.mjs';

const BODY_LIMIT = 32768;
const WINDOW = 600000;

// Removes rate-limit counters whose ten-minute window has expired, so .data/ stays bounded.
export async function pruneRateLimits(dataDir, now = Date.now()) {
  let removed = 0;
  let names = [];
  try { names = await readdir(dataDir); } catch { return 0; }
  for (const name of names) {
    if (!/^[0-9a-f]{64}\.json$/.test(name)) continue;
    const file = path.join(dataDir, name);
    try {
      const counter = JSON.parse(await readFile(file, 'utf8'));
      if (!(now - counter.start < WINDOW)) { await rm(file, { force: true }); removed++; }
    } catch { await rm(file, { force: true }); removed++; }
  }
  return removed;
}
const UNAVAILABLE = 'Enquiry delivery is not configured or unavailable. Please try again later.';
const SUCCESS = "Thanks. Your enquiry has been sent. We'll contact you using the email you provided.";

function reply(req, res, status, message, fields = {}, errors = {}) {
  const result = { ok: status === 200, message, errors };
  const json = req.headers.accept?.includes('application/json');
  res.writeHead(status, { 'Content-Type': json ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(json ? JSON.stringify(result) : responseHtml(result, fields));
}

function sameOrigin(req, env) {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false;
  if (!req.headers.origin) return true;
  try {
    const allowed = env.SITE_URL ? new URL(env.SITE_URL) : new URL(`http://${req.headers.host}`);
    return ['http:', 'https:'].includes(allowed.protocol) && req.headers.origin === allowed.origin;
  } catch { return false; }
}

export function createServer({ distDir = path.resolve('dist'), dataDir = path.resolve('.data'), env = process.env, transport } = {}) {
  transport = mailTransport(env, transport);
  let rateQueue = Promise.resolve();
  let lastPrune = 0;
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    // The page script probes this path on localhost for dev live reload; 204 tells it to stop.
    if (req.url === '/__reload') { res.writeHead(204); return res.end(); }
    if (req.url?.split('?')[0] !== '/api/enquiry') {
      if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); return res.end('Method not allowed'); }
      try {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        if (pathname.includes('\\') || pathname.includes('\0')) throw Error();
        let file = path.resolve(distDir, '.' + pathname);
        if (file !== path.resolve(distDir) && !file.startsWith(path.resolve(distDir) + path.sep)) throw Error();
        if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
        const data = await readFile(file);
        const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
        res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
        return res.end(req.method === 'HEAD' ? undefined : data);
      } catch {
        let page = '<h1>Page not found</h1><a href="/">Home</a>';
        try { page = await readFile(path.join(distDir, '404.html'), 'utf8'); } catch { /* built 404 page is optional */ }
        res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
        return res.end(req.method === 'HEAD' ? undefined : page);
      }
    }
    if(req.method !== 'POST') { res.writeHead(405, {'Allow':'POST'}); return res.end('Method not allowed'); }
    try {
      const consume = async () => {
        await mkdir(dataDir, {recursive:true});
        if (Date.now() - lastPrune >= WINDOW) { lastPrune = Date.now(); await pruneRateLimits(dataDir); }
        const key = createHash('sha256').update(req.socket.remoteAddress || 'unknown').digest('hex');
        const file = path.join(dataDir, key + '.json');
        let counter;
        try { counter = JSON.parse(await readFile(file, 'utf8')); } catch { counter = {start:Date.now(),count:0}; }
        if(Date.now()-counter.start >= WINDOW) counter = {start:Date.now(),count:0};
        counter.count++;
        await writeFile(file, JSON.stringify(counter));
        return counter.count > Number(env.RATE_LIMIT || 6);
      };
      const pending = rateQueue.then(consume); rateQueue = pending.catch(()=>{});
      if(await pending) { req.resume(); res.setHeader('Retry-After','600'); return reply(req,res,429,'Too many enquiries. Please try again later.'); }
    } catch { req.resume(); return reply(req,res,503,'Enquiry protection is unavailable. Please try again later.'); }
    const type = req.headers['content-type']?.split(';')[0].trim().toLowerCase();
    if (!['application/json', 'application/x-www-form-urlencoded'].includes(type)) {
      req.resume();
      return reply(req, res, 415, 'Use JSON or a URL-encoded HTML form.');
    }
    let input;
    try {
      const chunks = [];
      let size = 0;
      // Do not break an async iterator on overflow: that destroys the socket before the 413 can be read.
      if (Number(req.headers['content-length']) > BODY_LIMIT) {
        req.resume();
        return reply(req, res, 413, 'The enquiry is too large.');
      }
      for await (const chunk of req) {
        size += chunk.length;
        if (size > BODY_LIMIT) {
          req.resume();
          reply(req, res, 413, 'The enquiry is too large.');
          return;
        }
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks).toString('utf8');
      input = type === 'application/x-www-form-urlencoded' ? Object.fromEntries(new URLSearchParams(body)) : JSON.parse(body);
    } catch {
      return reply(req, res, 400, 'Invalid request body.');
    }
    const { fields, errors } = validateFields(input);
    if (!sameOrigin(req, env)) return reply(req, res, 403, 'Submit this enquiry from this website.', fields);
    if (fields.website) return reply(req, res, 400, 'Unable to submit this enquiry.', fields);
    if (Object.keys(errors).length) return reply(req, res, 400, 'Check the enquiry fields.', fields, errors);
    if (!transport) return reply(req, res, 503, UNAVAILABLE, fields);
    try {
      const result = await transport.sendMail({ from: env.SMTP_FROM, to: env.ENQUIRY_TO, replyTo: fields.email, subject: 'Vyoium AI website enquiry', text: `Name: ${fields.name}\nEmail: ${fields.email}\nSource: ${fields.source}\n\n${fields.message}`, disableFileAccess: true, disableUrlAccess: true });
      if (Array.isArray(result?.accepted) && result.accepted.includes(env.ENQUIRY_TO) && !result.rejected?.length) return reply(req, res, 200, SUCCESS);
    } catch { /* Never expose provider errors, credentials, or enquiry contents. */ }
    return reply(req, res, 503, UNAVAILABLE, fields);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createServer().listen(Number(process.env.PORT || 4321), process.env.HOST || '127.0.0.1');
}
