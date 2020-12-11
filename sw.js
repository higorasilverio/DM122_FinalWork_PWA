const cacheName = "kittens-pwa-v02";
const assetsToCache = [
  "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
  "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
  "https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.mjs",
  "https://fonts.googleapis.com/css?family=Roboto:400,700",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "./assets/images/pwa-logo.png",
  "./assets/js/material.min.js",
  "./assets/js/kittensService.js",
  "./assets/js/htmlService.js",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./manifest.json",
  "./favicon.ico",
  "./offline.html",
  "./index.html",
  "./",
];

function removeOldCache(key) {
  if (key !== cacheName) {
    return caches.delete(key);
  }
}

async function cacheCleanup() {
  const keyList = await caches.keys();
  return Promise.all(keyList.map(removeOldCache));
}

async function cacheStaticAssets() {
  const cache = await caches.open(cacheName);
  return cache.addAll(assetsToCache);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheStaticAssets());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(cacheCleanup());
  return self.clients.claim();
});

async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(cacheName);
    return cache.match(request);
  }
}

async function cacheFirst(request) {
  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    return response || fetch(request);
  } catch (error) {
    console.log(error);
  }
}

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});
