/* Firebase Cloud Messaging service worker untuk PARA BOENG.
   Letakkan di root publik GitHub Pages: /websetrongid/firebase-messaging-sw.js */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyApRQAlGhvkccuXHRE6xEKgZDnNBQpMPxo",
  authDomain: "data-boeng.firebaseapp.com",
  projectId: "data-boeng",
  messagingSenderId: "511128746426",
  appId: "1:511128746426:web:be10a471d00274329e4583"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "PARA BOENG";
  const options = {
    body: payload.notification?.body || "Ada pesan baru!",
    icon: "/websetrongid/icon-192.png",
    badge: "/websetrongid/icon-192.png",
    data: { url: payload.data?.url || "/websetrongid/#/chat" },
    tag: payload.data?.tag || "para-boeng-message",
    renotify: true
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/websetrongid/#/chat", self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientsList) {
      if (client.url.startsWith(self.location.origin) && "focus" in client) {
        await client.focus();
        client.navigate(target);
        return;
      }
    }
    if (clients.openWindow) await clients.openWindow(target);
  })());
});
