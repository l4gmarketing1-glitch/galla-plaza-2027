import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
// A custom Pages domain serves this project at /, not at the repository subpath.
const domain=await readFile(new URL('../CNAME',import.meta.url),'utf8').then(value=>value.trim()).catch(error=>{
 if(error.code==='ENOENT')return '';
 throw error;
});
const env={...process.env,DEPLOY_BASE:domain?'/':'/galla-plaza-2027/',VITE_DEMO_MODE:'true',SITE_URL:''};
for(const args of [
 ['node_modules/typescript/bin/tsc','--noEmit'],
 ['node_modules/vite/bin/vite.js','build'],
 ['node_modules/vite/bin/vite.js','build','--ssr','src/entry-server.tsx','--outDir','.ssr'],
 ['scripts/prerender.mjs'],
]){
 const result=spawnSync(process.execPath,args,{env,stdio:'inherit'});
 if(result.status!==0)process.exit(result.status??1);
}
await writeFile('dist/.nojekyll','');
if(domain)await writeFile('dist/CNAME',domain+'\n');
