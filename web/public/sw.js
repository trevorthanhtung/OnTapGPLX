const CACHE_NAME = 'ontapgplx-v2.0.0';
const QUESTIONS_CACHE = 'ontapgplx-questions-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.jpg',
  '/logo-light.png',
  '/logo-dark.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

// Install: Cache core app shell and immediately activate
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches (preserving questions offline pack) and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== QUESTIONS_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Large video files are handled via IndexedDB Cache-As-You-Play to avoid Safari range-request issues
  if (url.pathname.includes('/videos/') || request.headers.get('range')) {
    return;
  }

  // 600 Question Images: Dedicated Cache-First strategy with PNG-to-WebP transparent rewrite
  if (url.pathname.includes('/questions/')) {
    let targetPath = url.pathname;
    if (targetPath.endsWith('.png')) {
      targetPath = targetPath.replace(/\.png$/, '.webp');
    }
    const targetUrl = new URL(targetPath, url.origin).toString();

    event.respondWith(
      caches.open(QUESTIONS_CACHE).then(async (qCache) => {
        const cached = (await qCache.match(targetUrl)) || (await qCache.match(request));
        if (cached) {
          return cached;
        }

        try {
          const networkRes = await fetch(targetUrl);
          if (networkRes && networkRes.status === 200) {
            qCache.put(targetUrl, networkRes.clone());
            return networkRes;
          }
          return networkRes;
        } catch {
          // If network failed, try matching original request
          return (await qCache.match(request)) || Response.error();
        }
      })
    );
    return;
  }

  // HTML navigation requests: Network first, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Static assets (scripts, styles, images, fonts): Cache-first with network update
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache for next visit
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache valid responses
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
