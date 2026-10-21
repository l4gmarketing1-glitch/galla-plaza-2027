import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { reservationEndpoint } from './reservation-handler.mjs';
import { createSqliteStore } from './sqlite-store.mjs';
const root=resolve('dist'),store=createSqliteStore();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/api/reservations')return reservationEndpoint(req,res,store,{local:true});
 let path;try{path=resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));}catch{res.writeHead(400);return res.end();}
 if(!path.startsWith(root+sep)){res.writeHead(403);return res.end();}
 try{const data=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data);}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Pagina nu a fost găsită.');}
}).listen(4173,'127.0.0.1',()=>console.log('Galla Plaza preview: http://127.0.0.1:4173'));
