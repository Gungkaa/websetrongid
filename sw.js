const CACHE = 'boeng-v1';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Jaringan dulu (supaya update selalu terbaru), cache hanya cadangan saat offline.
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;
  if (new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r)
      .then(res => {
        if (res && res.status === 200) {
          const cp = res.clone();
          caches.open(CACHE).then(c => c.put(r, cp)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(r).then(x => x || caches.match('index.html')))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './#/chat';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) { c.postMessage({ go: 'chat' }); return c.focus(); }
      }
      return clients.openWindow(url);
    })
  );
});
