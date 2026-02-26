const GHPATH = '/Teacher_English';
const CACHE_NAME = 'english-teacher-v1';

const urlsToCache = [
  GHPATH + '/',
  GHPATH + '/index.html',
  GHPATH + '/style.css',
  GHPATH + '/app.js',
  GHPATH + '/manifest.json',
  GHPATH + '/icons/icon-192.png',
  GHPATH + '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
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
  );
});
