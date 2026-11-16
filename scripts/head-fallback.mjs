// Regenerates public/assets/head.svg, the static fallback shown with reduced
// motion, without JavaScript, and before the canvas renders. Run manually:
//   node scripts/head-fallback.mjs
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const scope={};vm.runInNewContext(readFileSync('public/assets/head.js','utf8'),scope);
const W=650,H=720,scale=290,cx=W*.52,cy=H*.36;
let seed=7;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const digits=Array.from({length:40},()=>`<text x="${(rnd()*W).toFixed(0)}" y="${(rnd()*H).toFixed(0)}" font-size="${(8+rnd()*9).toFixed(0)}" fill-opacity="${(.1+rnd()*.25).toFixed(2)}">${rnd()<.5?0:1}</text>`).join('');
const dots=scope.createBustPoints(true).filter(p=>!p.dust).map(p=>{const s=(p.size*1.1).toFixed(1);return `<rect x="${(cx+p.x*scale).toFixed(1)}" y="${(cy-(p.y-.5)*scale).toFixed(1)}" width="${s}" height="${s}" fill="${p.bright>.8?'#e9fbff':'#7fdcff'}" fill-opacity="${Math.min(1,p.bright).toFixed(2)}"/>`;}).join('');
writeFileSync('public/assets/head.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><radialGradient id="a"><stop offset="0" stop-color="#28aaff" stop-opacity=".18"/><stop offset="1" stop-color="#28aaff" stop-opacity="0"/></radialGradient></defs><circle cx="${cx}" cy="${cy+scale*.15}" r="${scale}" fill="url(#a)"/><g font-family="monospace" fill="#6ed7ff" text-anchor="middle">${digits}</g>${dots}</svg>`);
console.log('Static fallback regenerated from the particle bust geometry.');
