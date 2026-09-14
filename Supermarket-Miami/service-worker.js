// ============================================================
// Service Worker - ميامي ماركت PWA
// ============================================================
const CACHE_NAME = 'miami-market-v10';
const CACHE_VERSION = '1.0.0';

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
    './assets/images/icon-192.png',
    './assets/images/icon-512.png'
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

// أيقونات SVG (12)
const SVG_ICONS = [
    './assets/icons/cheese.svg',
    './assets/icons/meat.svg',
    './assets/icons/pasta.svg',
    './assets/icons/oil.svg',
    './assets/icons/vegetables.svg',
    './assets/icons/cans.svg',
    './assets/icons/tea.svg',
    './assets/icons/cookies.svg',
    './assets/icons/chips.svg',
    './assets/icons/water.svg',
    './assets/icons/misc.svg',
    './assets/icons/cleaning.svg'
];

// كل الملفات اللي هنخزنها
const ALL_ASSETS = [
    ...CORE_ASSETS,
    ...MAIN_IMAGES,
    ...CATEGORY_IMAGES,
    ...SVG_ICONS
];

// ============================================================
// Install - تخزين الملفات
// ============================================================
self.addEventListener('install', (event) => {
    console.log('[SW] Installing version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching all assets');
                // تخزين كل ملف لوحده عشان لو واحد فشل ما يوقفش الباقي
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
// Activate - حذف الكاش القديم
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
// Fetch - استراتيجية Cache First
// ============================================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // تجاهل الطلبات غير GET
    if (request.method !== 'GET') return;
    
    // تجاهل طلبات chrome extensions
    if (request.url.startsWith('chrome-extension://')) return;
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // لو موجود في الكاش، رجعه
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // لو مش موجود، اطلبه من الشبكة
                return fetch(request)
                    .then((networkResponse) => {
                        // خزنه في الكاش
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseClone);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // لو الشبكة فشلت وده HTML، رجع الصفحة الرئيسية
                        if (request.headers.get('accept')?.includes('text/html')) {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});
