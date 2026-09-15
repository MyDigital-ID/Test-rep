// ============================================================
// Service Worker - ميامي ماركت PWA
// ============================================================
const CACHE_VERSION = 'v5';
const CACHE_NAME = 'miami-market-' + CACHE_VERSION;

// الملفات الأساسية
const CORE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js'
];

// الصور الرئيسية
const MAIN_IMAGES = [
    './assets/images/Miami-logo.png',
    './assets/images/Miami-market.png',
    './assets/images/market-sc.jpg',
    './assets/images/shelves.png',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png'
];

// صور الأقسام (12)
const CATEGORY_IMAGES = [
    './assets/images/dairy.jpg',
    './assets/images/meat.jpg',
    './assets/images/pasta.jpg',
    './assets/images/oils.jpg',
    './assets/images/frozen.jpg',
    './assets/images/canned.jpg',
    './assets/images/tea.jpg',
    './assets/images/biscuits.jpg',
    './assets/images/chips.jpg',
    './assets/images/water.jpg',
    './assets/images/misc.jpg',
    './assets/images/cleaning.jpg'
];

// كل الملفات اللي هنخزنها
const ALL_ASSETS = [
    ...CORE_ASSETS,
    ...MAIN_IMAGES,
    ...CATEGORY_IMAGES
];

// ============================================================
// Install
// ============================================================
self.addEventListener('install', (event) => {
    console.log('[SW] Installing version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching all assets');
                return Promise.allSettled(
                    ALL_ASSETS.map(url => 
                        cache.add(url).catch(err => 
                            console.warn('[SW] Failed to cache:', url, err)
                        )
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
});

// ============================================================
// Activate
// ============================================================
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// ============================================================
// Fetch
// ============================================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    if (request.method !== 'GET') return;
    if (request.url.startsWith('chrome-extension://')) return;
    
    // HTML → Network First
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
        );
        return;
    }
    
    // الباقي → Cache First
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseClone);
                                });
                        }
                        return networkResponse;
                    });
            })
    );
});
