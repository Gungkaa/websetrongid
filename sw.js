// Service worker Para Boeng: menerima push (FCM) & menangani klik notifikasi.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  try { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); } catch (_) {}
  await self.clients.claim();
})()));

self.addEventListener("push", e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (_) { try { p = { body: e.data.text() }; } catch (__) {} }
  const d = p.data || p.notification || p;
  e.waitUntil(self.registration.showNotification(d.title || "Para Boeng", {
    body: d.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: d.tag || "chat",
    renotify: true,
    vibrate: [120, 60, 120],
    data: { url: d.url || "./#/chat" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./#/chat";
  const go = url.split("#/")[1] || "chat";
  e.waitUntil((async () => {
    const cs = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of cs) {
      if ("focus" in c) { await c.focus(); c.postMessage({ go }); return; }
    }
    await clients.openWindow(url);
  })());
});
