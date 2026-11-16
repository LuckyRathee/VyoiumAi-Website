// Regenerates public/assets/head.svg, the static fallback shown with reduced
// motion, without JavaScript, and before the canvas renders. It uses the same
// geometry and projection as the canvas renderer in app.js. Run manually:
//   node scripts/head-fallback.mjs
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const scope={};vm.runInNewContext(readFileSync('public/assets/head.js','utf8'),scope);
// Matches the desktop hero-art box (about 790 x 690) so object-fit:contain lines up with the canvas.
const W=790,H=690,s=Math.min(H*.95/2.6,W*.9/2.12),cx=W*.54,top=H*.05,yaw=-.12,c=Math.cos(yaw),sn=Math.sin(yaw);
const colors=['#486086','#6884ac','#8ea8cc','#b2c8e6','#d0e0f4','#ecf4ff'];
let seed=7;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const digits=Array.from({length:40},()=>`<text x="${(rnd()*W).toFixed(0)}" y="${(rnd()*H).toFixed(0)}" font-size="${(8+rnd()*12).toFixed(0)}" fill-opacity="${(.1+rnd()*.3).toFixed(2)}">${rnd()<.5?0:1}</text>`).join('');
const groups=colors.map(()=>[]);
for(const q of scope.createBustPoints(true)){const pr=q.burst?rnd():0,e=pr*pr*(3-2*pr),p=q.burst?{...q,x:q.x+q.dx*q.burst*e,y:q.y+q.dy*q.burst*e,bright:q.bright*(1-pr)}:q;const x=p.x*c+p.z*sn,z=p.z*c-p.x*sn,k=1/(1-z*.22);const px=cx+x*s*k,py=top+(1.2+(p.y-1.2)*k)*s,w=p.size.toFixed(1);groups[Math.min(5,Math.floor(p.bright*6))].push(`<rect x="${(px-p.size/2).toFixed(1)}" y="${(py-p.size/2).toFixed(1)}" width="${w}" height="${w}"/>`);}
const dots=groups.map((g,i)=>g.length?`<g fill="${colors[i]}" fill-opacity="${[.45,.6,.72,.85,.95,1][i]}">${g.join('')}</g>`:'').join('');
writeFileSync('public/assets/head.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><radialGradient id="a"><stop offset="0" stop-color="#789bdc" stop-opacity=".16"/><stop offset="1" stop-color="#789bdc" stop-opacity="0"/></radialGradient></defs><circle cx="${cx.toFixed(0)}" cy="${(top+s*.75).toFixed(0)}" r="${(s*1.2).toFixed(0)}" fill="url(#a)"/><g font-family="monospace" fill="#a9bfe0" text-anchor="middle">${digits}</g>${dots}</svg>`);
console.log('Static fallback regenerated from the particle bust geometry.');
