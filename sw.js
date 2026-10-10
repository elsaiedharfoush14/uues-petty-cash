const CACHE='uues-pc-v30';
const ASSETS=['./','index.html','exceljs.min.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','maskable-512.png','jsQR.js','logo-full.png','logo-mark.png','qr-install.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* never answer with nothing: an empty answer is Safari's «FetchEvent.respondWith … Returned response is null» page */
const OFFLINE='<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<title>عهدة UUES</title><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:-apple-system,Segoe UI,Tahoma,sans-serif;background:#0e3a74;color:#fff;text-align:center;padding:24px">'+
  '<div><div style="font-size:54px">📶</div><h2 style="margin:10px 0">النت مش واصل دلوقتي</h2><p style="opacity:.85;line-height:1.7">بياناتك وعهدك محفوظة على الموبايل — ما اتمسحش حاجة.<br>شغّل النت ودوس «جرّب تاني».</p>'+
  '<button onclick="location.reload()" style="font-size:18px;padding:14px 28px;border:0;border-radius:14px;background:#fff;color:#0e3a74;font-weight:700">🔄 جرّب تاني</button></div></body></html>';
const offline=()=>new Response(OFFLINE,{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  // version.json always goes to the network (it is how the app learns about a new release)
  if(new URL(r.url).pathname.endsWith('/version.json')) return;
  // the page: network first (to pick up updates); offline → the saved copy → a friendly «no internet» page
  if(r.mode==='navigate'){e.respondWith((async()=>{
    try{const res=await fetch(r);
      if(res&&res.ok&&res.type==='basic'){const cp=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cp)).catch(()=>{})}
      return res}
    catch(err){return (await caches.match('index.html'))||(await caches.match('./'))||offline()}})());return}
  // the rest: cache first
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp)).catch(()=>{})}return res}))
    .catch(()=>Response.error()));
});
