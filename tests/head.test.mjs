import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const load=()=>{const scope={};vm.runInNewContext(readFileSync('public/assets/head.js','utf8'),scope);return scope;};
test('particle bust follows human head-and-shoulders proportions',()=>{
 const {BUST,createBustPoints}=load();
 const w=y=>BUST.halfWidth(y)*2;
 // Head about three quarters as wide as it is tall; neck narrower than the head; shoulders about 2 head heights.
 assert.ok(w(.5)>.7&&w(.5)<.85,'head width');
 assert.ok(w(1.05)<w(.5)*.7&&w(1.05)>w(.5)*.5,'neck narrower than head');
 assert.ok(w(1.8)>1.9&&w(1.8)<2.2,'shoulder width');
 // Outline is smooth: no step changes between neighbouring heights.
 for(let y=.04;y<2.7;y+=.01)assert.ok(Math.abs(w(y+.01)-w(y))<.1,`smooth outline at ${y.toFixed(2)}`);
 assert.ok(BUST.inside(0,.5)&&BUST.inside(0,1.1)&&BUST.inside(.7,1.9),'head, neck and chest inside');
 assert.ok(!BUST.inside(.6,.5)&&!BUST.inside(.5,1.0)&&!BUST.inside(0,-.05),'background outside');
});
test('particle bust is a deterministic, lit point cloud',()=>{
 const {createBustPoints}=load();
 const points=createBustPoints(false);
 assert.ok(points.length>6000,'thousands of particles');
 assert.ok(points.every(p=>[p.x,p.y,p.z,p.bright,p.size,p.phase].every(Number.isFinite)));
 assert.deepEqual(createBustPoints(false).slice(0,20),points.slice(0,20),'seeded and stable');
 assert.ok(points.filter(p=>p.y<1).length>points.length*.2,'head carries a meaningful share');
 assert.ok(createBustPoints(true).length<points.length,'mobile uses fewer particles');
});
