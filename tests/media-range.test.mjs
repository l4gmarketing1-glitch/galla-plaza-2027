import test from 'node:test';
import assert from 'node:assert/strict';
import {byteRange} from '../server/byte-range.mjs';
test('video ranges support partial playback, seeking and suffix requests',()=>{
 assert.equal(byteRange(undefined,1000),null);
 assert.deepEqual(byteRange('bytes=0-99',1000),{start:0,end:99});
 assert.deepEqual(byteRange('bytes=500-',1000),{start:500,end:999});
 assert.deepEqual(byteRange('bytes=-100',1000),{start:900,end:999});
 assert.deepEqual(byteRange('bytes=500-2000',1000),{start:500,end:999});
});
test('unsatisfiable or malformed byte ranges are refused',()=>{
 for(const header of ['bytes=1000-','bytes=700-600','bytes=-0','bytes=-','bytes=x-y','bytes=0-2,4-8','bytes=999999999999999999999-'])assert.equal(byteRange(header,1000),false,header);
});
