/* Service worker khusus push (FCM). Letakkan di folder yang sama dengan index.html */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", event => {
  let p = {};
  try { p = event.data ? event.data.json() : {}; } catch (e) {}
  const d = p.data || p;
  const title = d.title || (p.notification && p.notification.title) || "Para Boeng";
  const body = d.body || (p.notification && p.notification.body) || "Ada pesan baru";
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: d.tag || "chat",
    renotify: true,
    vibrate: [120, 60, 120],
    data: { url: d.url || "./" }
  }));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "./";
  const hash = url.includes("#/") ? url.split("#/")[1] : "chat";
  event.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      try {
        await c.focus();
        c.postMessage({ go: hash });
        return;
      } catch (e) {}
    }
    if (self.clients.openWindow) await self.clients.openWindow(url);
  })());
});
