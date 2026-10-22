import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { byteRange } from './byte-range.mjs';
import { resolve, extname, sep } from 'node:path';
import { reservationEndpoint } from './reservation-handler.mjs';
import { createSqliteStore } from './sqlite-store.mjs';
const root=resolve('dist'),store=createSqliteStore();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/api/reservations')return reservationEndpoint(req,res,store,{local:true});
 let path;try{path=resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));}catch{res.writeHead(400);return res.end();}
 if(!path.startsWith(root+sep)){res.writeHead(403);return res.end();}
 try{
  const info=await stat(path);if(!info.isFile())throw new Error('Not a file');
  const range=byteRange(req.headers.range,info.size);
  if(range===false){res.writeHead(416,{'Content-Range':'bytes */'+info.size});return res.end();}
  const headers={'Content-Type':types[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes','Cache-Control':pathname.startsWith('/assets/')?'public, max-age=600':'no-cache','Content-Length':range?range.end-range.start+1:info.size};
  if(range)headers['Content-Range']='bytes '+range.start+'-'+range.end+'/'+info.size;
  res.writeHead(range?206:200,headers);
  if(req.method==='HEAD')return res.end();
  createReadStream(path,range||{}).on('error',()=>res.destroy()).pipe(res);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Pagina nu a fost găsită.');}
}).listen(4173,'127.0.0.1',()=>console.log('Galla Plaza preview: http://127.0.0.1:4173'));
