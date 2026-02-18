/* ═══════════════════════════════════════════════
   PLINKO∞ — Service Worker for PWA / iOS
   ═══════════════════════════════════════════════ */

const CACHE_NAME = 'plinko-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
    './icons/Logo.png',
    './js/config.js',
    './js/state.js',
    './js/upgrades.js',
    './js/prestige.js',
    './js/board.js',
    './js/renderer.js',
    './js/effects.js',
    './js/ui.js',
    './js/daily.js',
    './js/shop.js',
    './js/main.js',
];

// Install: cache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(
                names
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        )
    );
    self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip CDN requests (Matter.js, Google Fonts) — always network
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                // Cache successful responses
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
