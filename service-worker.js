const CACHE_NAME = "ohlio-v1";

const urlsToCache = [
  "/ohlio-dashboard/",
  "/ohlio-dashboard/index.html"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
