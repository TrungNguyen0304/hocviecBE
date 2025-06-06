// import Firebase SDK compat
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDZb5yKlepg6PJXR1ZXSkawLZsC0cKygcg",
    authDomain: "backend-api-5a7e6.firebaseapp.com",
    projectId: "backend-api-5a7e6",
    storageBucket: "backend-api-5a7e6.firebasestorage.app",
    messagingSenderId: "868163805151",
    appId: "1:868163805151:web:b8ded0868ab1c939e3ee6a",
    measurementId: "G-LVFTLC22NP"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
