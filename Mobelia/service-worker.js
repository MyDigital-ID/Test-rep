// ============================================================
// Modern Furniture - Service Worker
// ============================================================

const CACHE_VERSION = 'mobilya-v1.0.0';
const STATIC_CACHE = CACHE_VERSION + '-static';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';

const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './site-data-loader.js',
  './manifest.json',
  './admin.html',
  './admin.js',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' }))))
      .catch((err) => console.warn('[SW] Failed to cache:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('mobilya-') && cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) return;
  if (url.hostname.includes('github.com') || url.hostname.includes('githubusercontent.com')) return;
  if (request.method !== 'GET') return;

  if (isImage(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isData(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isDocument(request) || isStyleScript(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response('', { status: 404 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const offline = await caches.match('./index.html');
      if (offline) return offline;
    }
    return new Response('Offline', { status: 503 });
  }
}

function isImage(request) {
  const url = request.url.toLowerCase();
  return url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i) || request.destination === 'image';
}
function isData(request) {
  return request.url.toLowerCase().endsWith('.json');
}
function isDocument(request) {
  return request.mode === 'navigate' || request.destination === 'document';
}
function isStyleScript(request) {
  const url = request.url.toLowerCase();
  return url.endsWith('.css') || url.endsWith('.js') ||
         request.destination === 'style' || request.destination === 'script';
}