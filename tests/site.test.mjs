import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';

test('build emits substantive homepage and native contact path',()=>{
 const build=spawnSync(process.execPath,['scripts/build.mjs'],{encoding:'utf8'});
 assert.equal(build.status,0,build.stderr);
 const html=readFileSync('dist/index.html','utf8');
 assert.match(html,/Your business, working smarter\./);
 assert.match(html,/<h1[^>]*>What can Vyoium AI build for your business\?/);
 assert.match(html,/href="\/contact"/);
 assert.match(html,/<details/);
 assert.ok(existsSync('dist/contact/index.html'));
 assert.match(readFileSync('dist/contact/index.html','utf8'),/action="\/api\/enquiry"/);
});

