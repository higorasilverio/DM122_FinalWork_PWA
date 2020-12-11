const cacheName = "kittens-pwa-v1.0.0";

const assetToCache = ["offline.html"];

async function cacheStaticAssets() {
  try {
    const cache = await caches.open(cacheName);
    return await cache.addAll(assetToCache);
  } catch (error) {
    console.error("Failed to install assets cache: ", error);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheStaticAssets());
  self.skipWaiting();
});

function removeOldCache(cacheKey) {
  if (cacheKey !== cacheName) {
    return caches.delete(cacheKey);
  }
}

async function cacheCleanup() {
  const keyList = await caches.keys();
  return Promise.all(keyList.map(removeOldCache));
}

self.addEventListener("activate", (event) => {
  event.waitUntil(cacheCleanup());
  self.clients.claim();
});

async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(cacheName);
    return cache.match("offline.html");
  }
}

self.addEventListener("fetch", (event) => {
  event.respondWith(networkFirst(event.request));
});
