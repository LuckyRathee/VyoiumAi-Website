import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
test('particle geometry has explicit eyes nose lips and jaw contours',()=>{let code='';try{code=readFileSync('public/assets/head.js','utf8')}catch{}const scope={};vm.runInNewContext(code,scope);assert.equal(typeof scope.createHeadPoints,'function');const points=scope.createHeadPoints(false);assert.ok(points.length>5000);for(const feature of ['eyes','nose','lips','jaw'])assert.ok(points.filter(p=>p.feature===feature).length>50,feature);assert.ok(points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z)));});
