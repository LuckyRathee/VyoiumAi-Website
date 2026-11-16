import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const load=()=>{const scope={};vm.runInNewContext(readFileSync('public/assets/head.js','utf8'),scope);return scope;};
test('particle bust is a deterministic head-and-shoulders point cloud',()=>{
 const {createBustPoints,bustInside}=load();
 assert.equal(typeof createBustPoints,'function');
 const points=createBustPoints(false);
 assert.ok(points.length>3000,'thousands of particles');
 assert.ok(points.every(p=>[p.x,p.y,p.z,p.bright,p.size,p.phase].every(Number.isFinite)));
 assert.deepEqual(createBustPoints(false).slice(0,20),points.slice(0,20),'seeded and stable');
 assert.ok(bustInside(0,.47)&&bustInside(0,.1)&&bustInside(.5,-.4),'head, neck and shoulders are inside');
 assert.ok(!bustInside(.6,.6)&&!bustInside(0,.95),'background stays empty');
 const head=points.filter(p=>!p.dust&&p.y>.14).length,torso=points.filter(p=>!p.dust&&p.y<=.14).length;
 assert.ok(head>torso*.5,'head carries a meaningful share of particles');
 assert.ok(createBustPoints(true).length<points.length,'mobile uses fewer particles');
});
