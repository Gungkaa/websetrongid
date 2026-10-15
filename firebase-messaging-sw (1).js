/* Service worker push Para Boeng (FCM). Letakkan di folder yang sama dengan index.html. */
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

/* Pesan dikirim sebagai data-only dari Cloud Function, jadi notifikasi ditampilkan di sini. */
messaging.onBackgroundMessage(payload => {
  if (payload.notification) return; // sudah ditampilkan otomatis oleh FCM, hindari dobel
  const d = payload.data || {};
  return self.registration.showNotification(d.title || "Para Boeng", {
    body: d.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || "chat",
    renotify: true,
    vibrate: [120, 60, 120],
    data: { url: d.url || "#/chat" }
  });
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const hash = (e.notification.data && e.notification.data.url) || "#/chat";
  const go = hash.replace(/^#\/?/, "");
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ("focus" in c) { c.postMessage({ go }); return c.focus(); }
      }
      return self.clients.openWindow("./" + hash);
    })
  );
});
