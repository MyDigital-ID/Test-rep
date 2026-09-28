// ============================================================
// HANON STORE - Service Worker
// نسخة: v2.0.0
// ============================================================

const CACHE_VERSION = 'hanon-v2.0.0';
const STATIC_CACHE = CACHE_VERSION + '-static';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';

// ملفات ثابتة - نخزنها من الأول
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

// ============================================================
// تثبيت Service Worker
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch((err) => {
        console.warn('[SW] Failed to cache some assets:', err);
      })
  );
  
  // تفعيل فوري
  self.skipWaiting();
});

// ============================================================
// تنشيط Service Worker
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // امسح الكاشات القديمة
          if (cacheName.startsWith('hanon-') && cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // السيطرة على كل الصفحات
      return self.clients.claim();
    })
  );
});

// ============================================================
// اعتراض الطلبات
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // تجاهل الطلبات الخارجية (Unsplash، Google Fonts، GitHub API)
  if (url.origin !== location.origin) {
    return;
  }
  
  // تجاهل طلبات GitHub API
  if (url.hostname.includes('github.com') || url.hostname.includes('githubusercontent.com')) {
    return;
  }
  
  // تجاهل POST/PUT/etc
  if (request.method !== 'GET') {
    return;
  }
  
  // ============ الصور والأيقونات: Cache First ============
  if (isImage(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // ============ البيانات (JSON): Network First ============
  if (isData(request)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // ============ HTML/CSS/JS: Network First مع fallback ============
  if (isDocument(request) || isStyleScript(request)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // ============ أي حاجة تانية: Network First ============
  event.respondWith(networkFirst(request));
});

// ============================================================
// استراتيجية Cache First (للصور)
// ============================================================
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // لو مفيش نت ومش مخزنة، رجّع أيقونة احتياطية
    return new Response('', { status: 404 });
  }
}

// ============================================================
// استراتيجية Network First (للبيانات والـ HTML)
// ============================================================
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // فشل النت → رجّع من الكاش
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // لو الصفحة مفيهاش كاش → رجّع صفحة offline
    if (request.mode === 'navigate') {
      const offline = await caches.match('./index.html');
      if (offline) return offline;
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// ============================================================
// أدوات التحقق من نوع الملف
// ============================================================
function isImage(request) {
  const url = request.url.toLowerCase();
  return url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i) || 
         request.destination === 'image';
}

function isData(request) {
  const url = request.url.toLowerCase();
  return url.endsWith('.json');
}

function isDocument(request) {
  return request.mode === 'navigate' || 
         request.destination === 'document';
}

function isStyleScript(request) {
  const url = request.url.toLowerCase();
  return url.endsWith('.css') || 
         url.endsWith('.js') ||
         request.destination === 'style' ||
         request.destination === 'script';
}

// ============================================================
// رسائل من الصفحة الرئيسية
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('🚀 [SW] Service Worker script loaded');