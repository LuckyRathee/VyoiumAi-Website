import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const scope={};vm.runInNewContext(readFileSync('public/assets/head.js','utf8'),scope);
const angle=-.16,scale=300;
const circles=scope.createHeadPoints(true).map(p=>{const x=p.x*Math.cos(angle)+p.z*Math.sin(angle);const z=p.z*Math.cos(angle)-p.x*Math.sin(angle);const k=1+z*.14;return `<circle cx="${(325+x*scale*k).toFixed(2)}" cy="${(340-p.y*scale*k).toFixed(2)}" r="${(p.size*k).toFixed(2)}" fill="${p.color}" opacity="${p.feature==='back'?.1:.8}"/>`;}).join('');
writeFileSync('public/assets/head.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 720">${circles}</svg>`);
console.log('Static fallback regenerated from defined facial geometry.');
