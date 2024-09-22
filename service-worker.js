const CACHE_NAME = "habit-tracker-cache-v1";
const BASE_PATH = "/test-pwa/"; // Repository name

const urls = ["", "index.html", "style.css", "script.js", "manifest.json", "icons/icon-192x192.png", "icons/icon-512x512.png"];
const urlsToCache = urls.map((url) => BASE_PATH + url);

// Install the service worker and cache resources
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});

// Network-first strategy
self.addEventListener("fetch", (event) => {
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				// If the request is successful, clone and store it in the cache
				return caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, response.clone());
					return response;
				});
			})
			.catch(() => {
				// If the network request fails, return from cache
				return caches.match(event.request);
			})
	);
});

// Update the service worker
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
