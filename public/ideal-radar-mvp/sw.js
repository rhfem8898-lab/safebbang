const CACHE='ideal-radar-mvp-v15';
const ASSETS=['./','./index.html','./styles.css?v=15','./avatar-v5.css?v=15','./avatar-realistic-v8.css?v=15','./avatar-reference-v10.css?v=15','./avatar-photo-v12.css?v=15','./app-v4.js?v=15','./avatar-v5.js?v=15','./avatar-realistic-v8.js?v=15','./avatar-reference-v10.js?v=15','./avatar-photo-v12.js?v=15','./reference-avatar-builder.webp','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
