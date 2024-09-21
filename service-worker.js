const CACHE_NAME = "habit-tracker-cache-v1";
const urlsToCache = ["/", "/index.html", "/style.css", "/script.js", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"];

// Install the service worker and cache the necessary files
self.addEventListener("install", (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

// Intercept network requests and respond from cache if available
self.addEventListener("fetch", (event) => {
	event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});

// Update the service worker and remove old caches
self.addEventListener("activate", (event) => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (!cacheWhitelist.includes(cacheName)) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
