importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "BDX7NZSlnQr6IhZvhSxn85HRGGpwcN11aR-o40FOka6lV58MHVVzzJBqPwNWzZqWDtqd4f1Uvdq6rHDjrGKoNwg",
  authDomain: "data-boeng.firebaseapp.com",
  projectId: "data-boeng",
  storageBucket: "data-boeng.firebasestorage.app",
  messagingSenderId: "511128746426",
  appId: "1:511128746426:web:be10a471d00274329e4583"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || "PARA BOENG";

  const notificationOptions = {
    body: payload.notification?.body || "Ada pesan baru!",
    icon: "/favicon.ico",
    data: payload.data || {}
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("https://gungkaa.github.io/websetrongid/")
  );
});
