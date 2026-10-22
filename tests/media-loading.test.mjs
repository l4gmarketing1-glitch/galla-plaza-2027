import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync, existsSync } from 'node:fs';
import { mediaPreloadScript } from '../scripts/media-preload.mjs';
const manifest=JSON.parse(readFileSync('src/lib/media-manifest.json','utf8'));
function hints(hash,width){
 const links=[];
 const script=mediaPreloadScript(manifest,'/galla-plaza-2027/').replace(/^<script>|<\/script>$/g,'');
 vm.runInNewContext(script,{innerWidth:width,location:{hash},Set,addEventListener(){},document:{createElement:()=>({}),head:{appendChild:link=>links.push(link)},addEventListener(){}}});
 return links;
}
test('direct links prioritize only the destination photos, with the GitHub project base',()=>{
 const kids=hints('#copii',1440);
 assert.equal(kids.length,4);
 assert.ok(kids.every(x=>x.type==='image/avif'&&x.imageSrcset.includes('/galla-plaza-2027/assets/optimized/activity-')));
 assert.equal(hints('#copii',375).length,1);
 assert.equal(hints('#experiente',1440).length,3);
 assert.equal(hints('#restaurante',1440).length,2);
 assert.equal(hints('',1440).length,0);
 assert.equal(hints('#rezervare',1440).length,0);
 assert.equal(hints('#unknown',375).length,0);
});
test('every responsive image has valid on-disk AVIF and WebP alternatives and an embedded preview',()=>{
 assert.equal(Object.keys(manifest).length,11);
 for(const item of Object.values(manifest)){
  assert.match(item.placeholder,/^data:image\/webp;base64,/);
  assert.ok(item.variants.length>=2);
  for(const variant of item.variants){
   assert.ok(variant.width<=item.width);
   for(const type of ['avif','webp']){
    assert.ok(existsSync('public'+variant[type]));
    const bytes=readFileSync('public'+variant[type]);
    assert.ok(bytes.length>100);
    assert.ok(bytes.subarray(0,24).includes(Buffer.from(type==='avif'?'ftypavif':'WEBP')));
   }
  }
 }
});
