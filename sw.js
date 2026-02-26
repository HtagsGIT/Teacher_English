const GHPATH = '/Teacher_English';
const CACHE_NAME = 'english-teacher-v1';

// Liste MINIMALE pour éviter les erreurs
const urlsToCache = [
  GHPATH + '/',
  GHPATH + '/index.html',
  GHPATH + '/style.css',
  GHPATH + '/app.js',
  GHPATH + '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Erreur addAll:', err);
          // Continue même si certains fichiers échouent
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => fetch(event.request))
  );
});
