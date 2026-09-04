const CACHE='ideal-radar-mvp-v5';
const ASSETS=['./','./index.html','./styles.css?v=5','./avatar-v5.css?v=5','./app-v4.js?v=5','./avatar-v5.js?v=5','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
