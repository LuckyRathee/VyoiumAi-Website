import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const base=process.env.TEST_URL||'http://localhost:4321';
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base);
 await page.waitForTimeout(600); assert.ok(Number(await page.locator('#particle-head').getAttribute('data-particle-count'))>3000,'particle bust rendered'); assert.equal(await page.locator('.hero-art').evaluate(el=>el.classList.contains('rendered')),true);
 await page.locator('.motion-toggle').click(); assert.equal(await page.locator('.motion-toggle').innerText(),'Resume animation'); await page.locator('.motion-toggle').click();
 for(const route of ['/services','/services/ai-agents','/services/automation-integrations','/services/websites','/services/ai-consulting','/services/managed-support','/voice-agent','/about','/contact','/privacy','/terms','/sitemap.xml','/robots.txt','/assets/head.svg','/assets/head.js','/assets/app.js','/assets/styles.css']) assert.equal((await page.request.get(base+route)).status(),200,route);
 await page.goto(base); await page.locator('a[data-enquiry]').first().click();
 await assert.doesNotReject(()=>page.locator('#enquiry-dialog').waitFor({state:'visible'}));
 assert.equal(await page.locator('#enquiry-dialog').evaluate(el=>el.contains(document.activeElement)),true);
 await page.keyboard.press('Escape'); assert.equal(await page.locator('#enquiry-dialog').isVisible(),false);
 assert.equal(await page.locator('a[data-enquiry]').first().evaluate(el=>el===document.activeElement),true);
 await page.locator('.faq summary').first().click(); assert.equal(await page.locator('.faq details').first().getAttribute('open'),'');
 await mkdir('artifacts',{recursive:true}); await page.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
 for(const width of [390,768,1440]) {await page.setViewportSize({width,height:900});await page.goto(base);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow ${width}`);}
 await page.setViewportSize({width:390,height:844}); await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
 const nojs=await browser.newContext({javaScriptEnabled:false}); const raw=await nojs.newPage();await raw.goto(base); assert.match(await raw.locator('h1').innerText(),/What can Vyoium/);await raw.locator('.faq summary').first().click();assert.equal(await raw.locator('.faq details').first().getAttribute('open'),'');await raw.goto(base+'/contact'); await raw.locator('main input[name=name]').fill('Website Test');await raw.locator('main input[name=email]').fill('test@example.com');await raw.locator('main textarea').fill('Local verification only.');await raw.locator('main button[type=submit]').click();assert.match(await raw.locator('body').innerText(),/unavailable|not configured/i);await nojs.close();
 await page.emulateMedia({reducedMotion:'reduce'}); await page.goto(base); assert.equal(await page.locator('.motion-toggle').isVisible(),false);
 assert.deepEqual(errors,[]);console.log('Browser checks passed: particle bust + pause toggle, all routes/assets, dialog focus/Escape, native FAQ, responsive overflow, no-JS contact failure, reduced motion; screenshots saved.');
} finally {await browser.close();}
