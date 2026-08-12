const CACHE_NAME = 'yt-exchange-v1';
const urlsToCache = [
  './exchange_tracker.html',
  './css/style.css',
  './icons/exchange-192.png',
  './icons/exchange-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Network was successful, save a copy to cache for offline use
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          if (!event.request.url.includes('open.er-api.com')) {
            cache.put(event.request, responseClone);
          }
        });
        return response;
      })
      .catch(() => {
        // Network failed (offline), try fetching from cache
        return caches.match(event.request);
      })
  );
});
