const CACHE_NAME = 'gems-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/images/logo.webp',
    '/assets/sound/start-sound.mp3',
    '/assets/sound/win-sound.mp3',
    '/css/style.css',
    '/js/ImageGroupsSetup.js',
    '/js/common.js',
    '/js/index.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
