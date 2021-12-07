// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    // '/',
    './',
    './css/style.css',
    './js/app.js',
    './js/sw-utils.js',
    './img/android-chrome-192x192.png',
    './img/android-chrome-256x256.png',
    './img/apple-touch-icon.png',
    './img/favicon-16x16.png',
    './img/favicon-32x32.png',
    './img/favicon.ico',
    './img/mstile-150x150.png',
    './img/safari-pinned-tab.svg',
    './img/browserconfig.xml'
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'
];



self.addEventListener('install', e => {


    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));



    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil(respuesta);

});




self.addEventListener('fetch', e => {


    const respuesta = caches.match(e.request).then(res => {

        if (res) {
            return res;
        } else {

            return fetch(e.request).then(newRes => {

                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

            });

        }

    });



    e.respondWith(respuesta);

});