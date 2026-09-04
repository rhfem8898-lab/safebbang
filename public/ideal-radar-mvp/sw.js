const CACHE='ideal-radar-mvp-v8';
const ASSETS=['./','./index.html','./styles.css?v=8','./avatar-v5.css?v=8','./avatar-realistic-v8.css?v=8','./app-v4.js?v=8','./avatar-v5.js?v=8','./avatar-realistic-v8.js?v=8','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
