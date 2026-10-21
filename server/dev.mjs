import { createServer } from 'vite';
import { reservationEndpoint } from './reservation-handler.mjs';
import { createSqliteStore } from './sqlite-store.mjs';
const store=createSqliteStore();
const vite=await createServer({server:{port:5173,host:'127.0.0.1'},plugins:[{name:'local-reservations',configureServer(server){server.middlewares.use('/api/reservations',(req,res)=>{void reservationEndpoint(req,res,store,{local:true});});}}]});
await vite.listen();vite.printUrls();
