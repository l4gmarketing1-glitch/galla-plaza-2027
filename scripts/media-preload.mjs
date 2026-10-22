// Discover the images for a direct section link before the browser lays out the long page.
export function mediaPreloadScript(manifest,base='/'){
 const entries=Object.fromEntries(Object.entries(manifest).map(([id,item])=>[id,item.variants.map(v=>({width:v.width,url:base+v.avif.replace(/^\//,'')}))]));
 const groups={
  experiente:{ids:['activity-music','activity-fireworks','activity-desserts'],sizes:'(max-width: 760px) 88vw, 29vw',desktop:3},
  copii:{ids:['activity-face-painting','activity-hair-styling','activity-games','activity-workshops'],sizes:'(max-width: 600px) 88vw, (max-width: 1000px) 43vw, 22vw',desktop:4},
  restaurante:{ids:['ciorbar-revelion','tajine-revelion','game-on-revelion','rossa-revelion'],sizes:'(max-width: 600px) 88vw, 42vw',desktop:2},
 };
 for(const [hash,id] of [['ciorbar','ciorbar-revelion'],['mamas-tajine','tajine-revelion'],['game-on','game-on-revelion'],['rosa','rossa-revelion']])groups[hash]={ids:[id],sizes:groups.restaurante.sizes,desktop:1};
 groups['children-title']=groups.copii;
 return `<script>(function(){const images=${JSON.stringify(entries)},groups=${JSON.stringify(groups)},seen=new Set();function prime(hash){const group=groups[hash.replace(/^#/,'')];if(!group)return;for(const id of group.ids.slice(0,innerWidth<760?1:group.desktop)){if(seen.has(id))continue;seen.add(id);const variants=images[id],link=document.createElement('link');link.rel='preload';link.as='image';link.type='image/avif';link.imageSrcset=variants.map(v=>v.url+' '+v.width+'w').join(', ');link.imageSizes=group.sizes;link.href=variants[variants.length-1].url;link.fetchPriority='high';document.head.appendChild(link);}}prime(location.hash);addEventListener('hashchange',()=>prime(location.hash));document.addEventListener('click',event=>{const a=event.target instanceof Element?event.target.closest('a[href]'):null;if(!a)return;const url=new URL(a.href,location.href);if(url.origin===location.origin&&url.pathname===location.pathname)prime(url.hash);},{capture:true});})();</script>`;
}
