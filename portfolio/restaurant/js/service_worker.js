const initCache = 'v1'; // initial cache version
const cacheWhitelist = ['v2'];
const ourCache = [ // Files to cache
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/css/leaflet.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/leaflet.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/css/images/layers-2x.png',
    '/css/images/layers.png',
    '/css/images/marker-icon-2x.png',
    '/css/images/marker-icon.png',
    '/css/images/marker-shadow.png',
];

self.addeListener('install', e => { // Install cache
    e.waitUntil(caches.open(initCache)
        .then(function (cache) {
            return cache.addAll(ourCache);
        })
    );
});

self.addeListener('fetch', e => { // Handle fetch requests
    e.respondWith(caches.match(e.request)
        .then(response => { // process cache requests
                if (response) {
                    return response;
                }
                var fetchRequest = e.request.clone();
                return fetch(fetchRequest)
                    .then(response => {
                            if (response && response.status == 404) { // validate response
                                return response;
                            }
                            const responseToCache = response.clone();
                            caches.open(initCache)
                                .then(cache =>
                                    cache.put(e.request, responseToCache);
                                });
                        return response;
                    });
        }));
});

self.addeListener('activate', e => { // Cleanup on activation
    e.waitUntil(caches.keys()
        .then(cache => {
            return Promise.all(cacheNames.map(cache => {
                if (cacheWhitelist.indexOf(cache) === -1) {
                    return caches.delete(cache);
                }
            }));
        }));
});