// Visual and layout audit: captures every page at desktop, tablet and mobile widths,
// key interactive states, and prints one JSON line of measurements per page.
// Usage: start a server (node dev.mjs, or PORT=4400 node server.mjs), then
//   npm run audit            (TEST_URL overrides the default http://localhost:4321)
// Screenshots go to artifacts/audit/ (git-ignored). Exit code 1 if any page has an issue.
import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
const out = process.argv[2] || 'artifacts/audit'; mkdirSync(out, {recursive: true});
const base = process.env.TEST_URL || 'http://localhost:4321';
const pages = [['home', '/'], ['services', '/services'], ['svc-agents', '/services/ai-agents'], ['voice', '/voice-agent'], ['about', '/about'], ['contact', '/contact'], ['privacy', '/privacy'], ['terms', '/terms'], ['404', '/missing-page']];
const b = await chromium.launch({channel: 'chrome'});
const report = [];
async function settle(p) {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(90); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
}
for (const [w, tag] of [[1440, 'd'], [1024, 't'], [390, 'm']]) {
  for (const [name, path] of pages) {
    if (tag === 't' && !['home', 'services', 'contact'].includes(name)) continue;
    const p = await b.newPage({viewport: {width: w, height: 900}});
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/__reload/.test(m.text())) errs.push('console: ' + m.text()); });
    await p.goto(base + path); await p.waitForTimeout(900); await settle(p);
    await p.screenshot({path: `${out}/${name}-${tag}.png`, fullPage: true});
    const m = await p.evaluate(() => {
      const small = [...document.querySelectorAll('p,li,a,span,label,summary,button')].filter(e => e.offsetParent && e.textContent.trim() && !e.closest('[aria-hidden]') && parseFloat(getComputedStyle(e).fontSize) < 11).length;
      const clipped = [...document.querySelectorAll('h1,h2,h3,.button,nav a')].filter(e => e.offsetParent && e.scrollWidth > e.clientWidth + 2).map(e => e.textContent.trim().slice(0, 30));
      const taps = [...document.querySelectorAll('a,button,summary')].filter(e => e.offsetParent && !e.closest('[aria-hidden]')).filter(e => { const r = e.getBoundingClientRect(); return r.height < 24 && r.width > 0; }).map(e => e.textContent.trim().slice(0, 20));
      return {overflow: document.documentElement.scrollWidth > innerWidth, h1: document.querySelectorAll('h1').length, tinyText: small, clipped, shortTargets: taps.slice(0, 8), hiddenReveals: [...document.querySelectorAll('.reveal:not(.in)')].length};
    });
    report.push({page: name + '-' + tag, ...m, errs});
    await p.close();
  }
}
// States: open dialog, open FAQ, services menu, focus ring, keyboard.
const p = await b.newPage({viewport: {width: 1440, height: 900}});
await p.goto(base); await p.waitForTimeout(800);
await p.locator('a[data-enquiry]').first().click(); await p.waitForTimeout(500); await p.screenshot({path: `${out}/state-dialog.png`});
await p.keyboard.press('Escape');
await p.locator('.service-menu summary').click(); await p.waitForTimeout(300); await p.screenshot({path: `${out}/state-menu.png`, clip: {x: 600, y: 0, width: 840, height: 420}});
await p.locator('.service-menu summary').click();
await p.locator('.faq summary').first().scrollIntoViewIfNeeded(); await p.locator('.faq summary').first().click(); await p.waitForTimeout(400);
await p.keyboard.press('Tab'); await p.waitForTimeout(200);
await p.screenshot({path: `${out}/state-faq.png`});
// No-JS enquiry response page.
const nj = await b.newContext({javaScriptEnabled: false, viewport: {width: 1440, height: 900}}); const r = await nj.newPage();
await r.goto(base + '/contact'); await r.locator('main input[name=name]').fill('Test'); await r.locator('main input[name=email]').fill('t@example.com'); await r.locator('main textarea').fill('Audit only.'); await r.locator('main button[type=submit]').click(); await r.waitForTimeout(500);
await r.screenshot({path: `${out}/state-enquiry-result.png`, fullPage: true});
await r.goto(base); await r.screenshot({path: `${out}/state-nojs-home.png`});
await b.close();
let failed = 0;
for (const row of report) {
  const notFound = row.page.startsWith('404');
  const problems = [];
  if (row.overflow) problems.push('horizontal overflow');
  if (row.h1 !== 1) problems.push('h1 count ' + row.h1);
  if (row.tinyText) problems.push(row.tinyText + ' text nodes under 11px');
  if (row.clipped.length) problems.push('clipped: ' + row.clipped.join(', '));
  const short = row.shortTargets.filter(t => t !== 'Privacy notice'); // inline text links are exempt
  if (short.length) problems.push('short tap targets: ' + short.join(', '));
  if (row.hiddenReveals) problems.push(row.hiddenReveals + ' reveals never shown');
  if (row.errs.length > (notFound ? 1 : 0)) problems.push('errors: ' + row.errs.join(' | '));
  if (problems.length) failed++;
  console.log(JSON.stringify({page: row.page, ok: !problems.length, problems}));
}
console.log(failed ? `Audit found issues on ${failed} page captures.` : `Audit clean: ${report.length} page captures, no issues. Screenshots in ${out}/.`);
process.exitCode = failed ? 1 : 0;
