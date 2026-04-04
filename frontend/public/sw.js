// Simple service worker to enable PWA install prompt
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests, but catch errors to avoid unhandled rejections
  event.respondWith(
    fetch(event.request).catch((err) => {
      // Return a basic error response or just let it fail silently in the background
      console.warn('SW fetch failed:', event.request.url, err);
      // For images/assets, we could return a fallback, but for now we just throw so the browser handles it
      throw err;
    })
  );
});
