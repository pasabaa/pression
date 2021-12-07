//Asignar nombre y versión a la cache
const CACHE_NAME = "v1_pwa_moduloencuestas";
//Archivos para la cache (no acepta carpetas)
var urlsToCache = [
    './',
    './css/style.css',
    './js/app.js',
    './img/favicon/favicon.ico',
    './img/favicon-16x16.png',
    './img/favicon-32x32.png',

];

/*-----------EVENTOS-------------*/
//install: instalar el service worker y guardar en cache recursos estáticos
self.addEventListener('install', e =>{
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then( cache => {
                return cache.addAll(urlsToCache)
                    .then( () => {
                        console.log("Instalación completa en cache");
                        self.skipWaiting();
                    })
            })
            .catch( err => {
                console.log("No se pudo registrar la cache", err);
            })
    );
});



//activate: ayuda a que la app pueda funcionar sin conexión
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME];
    e.waitUntil(
        caches.keys()
            .then( cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if( cacheWhitelist.indexOf(cacheName) === -1 ){
                            console.log("Activado correctamente");
                            return caches.delete( cacheName );
                        }
                    })
                )
            })
            .then( () => {
                self.clients.claim(); //activar cache en todos los clientes
            })
    )
});

//fetch
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match( e.request )
            .then( resp => {
                if(resp){
                    return resp;
                }
                return fetch( e.request );
            })
    );
});

self.addEventListener('error', function(e) {
    console.log(e.filename, e.lineno, e.colno, e.message);
  });