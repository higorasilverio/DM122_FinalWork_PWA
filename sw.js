self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando service worker");
  event.waitUntil(
    caches.open("kitten-app-v1").then((cache) => {
      return cache.addAll(['offline.html']);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activanting service worker");
});

async function networkFirst(request) {
    try {
        return await fetch(request);
    }
    catch {
        const cache = await caches.open("kitten-app-v1");
        return cache.match('offline.html');
    }
}

self.addEventListener("fetch", (event) => {
//   console.log("Service Worker: Fetching event");
    event.respondWith(networkFirst(event.request));
});
