const CACHE_NAME = 'gems-cache-v2';

// Получаем базовый путь из текущего расположения скрипта
const getBasePath = () => {
    const scriptPath = self.location.pathname;
    return scriptPath.substring(0, scriptPath.lastIndexOf('/'));
};

const BASE_PATH = getBasePath();

const CORE_ASSETS = [
    'index.html',
    'assets/images/logo.webp',
    'assets/images/page-bg.webp',
    'assets/images/page-bg-mobile.webp',
    'assets/images/frame.webp',
    'assets/images/frame-mobile.webp',
    'assets/images/modal-background.webp',
    'assets/sound/start-sound.mp3',
    'assets/sound/win-sound.mp3',
    'css/style.css',
    'js/background-lazy-loader.js',
    'js/image-groups-setup.js',
    'js/common.js',
    'js/index.js'
];

// Добавляем базовый путь к каждому ресурсу
const urlsToCache = [BASE_PATH + '/'].concat(
    CORE_ASSETS.map(path => BASE_PATH + '/' + path)
);

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Кэшируем ресурсы по одному
                return Promise.all(
                    urlsToCache.map(url => {
                        return fetch(url)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to cache ${url}`);
                                }
                                return cache.put(url, response);
                            })
                            .catch(error => {
                                console.warn(`Failed to cache ${url}:`, error);
                                // Продолжаем работу даже если не удалось закэшировать один из ресурсов
                                return Promise.resolve();
                            });
                    })
                );
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Начинаем использовать новый Service Worker немедленно,
                // не дожидаясь закрытия всех вкладок
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Проверяем, что запрос относится к нашему домену
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    // Возвращаем кэшированный ответ если он есть
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Иначе делаем сетевой запрос
                    return fetch(event.request)
                        .then(response => {
                            // Проверяем валидность ответа
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            // Кэшируем новый успешный ответ
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        })
                        .catch(error => {
                            console.error('Fetch failed:', error);
                            // Возвращаем заглушку или страницу ошибки
                            return new Response('Network error happened', {
                                status: 408,
                                headers: new Headers({
                                    'Content-Type': 'text/plain'
                                })
                            });
                        });
                })
        );
    }
});

// Обработка ошибок
self.addEventListener('error', (event) => {
    console.error('ServiceWorker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('ServiceWorker unhandled rejection:', event.reason);
});
