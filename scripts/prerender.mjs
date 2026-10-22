import { readFile, writeFile } from 'node:fs/promises';
import { render } from '../.ssr/entry-server.js';
import { mediaPreloadScript } from './media-preload.mjs';
const raw=process.env.SITE_URL?.replace(/\/$/,'');
const site=raw?new URL(raw).origin:null;
if(site&&!site.startsWith('https://'))throw new Error('SITE_URL must be HTTPS for public SEO.');
let html=await readFile('dist/index.html','utf8');
const media=JSON.parse(await readFile('src/lib/media-manifest.json','utf8'));
html=html.replace('</head>',mediaPreloadScript(media,process.env.DEPLOY_BASE||'/')+'</head>');
html=html.replace('<div id="root"></div>',`<div id="root">${render()}</div>`);
const schema={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':site?`${site}/#organization`:'#organization',name:'Galla Plaza',telephone:'+40755436284',email:'office@gallaplaza.ro',address:{'@type':'PostalAddress',streetAddress:'Șoseaua Ștefănești 63',addressLocality:'Ștefăneștii de Jos',addressRegion:'Ilfov',postalCode:'077175',addressCountry:'RO'}}, {'@type':'Event',name:'Revelion 2027 la Galla Plaza',description:'Patru restaurante, muzică live, activități pentru copii și experiențe de Revelion.',startDate:'2026-12-31',endDate:'2027-01-01',eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',location:{'@type':'Place',name:'Galla Plaza',address:{'@type':'PostalAddress',streetAddress:'Șoseaua Ștefănești 63',addressLocality:'Ștefăneștii de Jos',addressRegion:'Ilfov',postalCode:'077175',addressCountry:'RO'}},organizer:{'@id':site?`${site}/#organization`:'#organization'},...(site?{url:site,image:[`${site}/assets/galla-og.jpg`]}:{}),offers:[{name:'Adult',price:950,priceCurrency:'RON',...(site?{url:`${site}/#rezervare`}:{})},{name:'Copil',price:650,priceCurrency:'RON',...(site?{url:`${site}/#rezervare`}:{})}].map(x=>({'@type':'Offer',...x}))}]};
let seo=`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
if(site){seo+=`<link rel="canonical" href="${site}/"/><meta property="og:url" content="${site}/"/>`;html=html.replace('noindex,nofollow','index,follow,max-image-preview:large').replace('content="/assets/galla-og.jpg"',`content="${site}/assets/galla-og.jpg"`);}
html=html.replace('<!--seo-->',seo);
await writeFile('dist/index.html',html);
await writeFile('dist/robots.txt',site?`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site?`<url><loc>${site}/</loc></url>`:''}</urlset>`);
console.log(`Prerendered full Romanian HTML. SEO: ${site?'public '+site:'private preview (noindex)'}.`);
