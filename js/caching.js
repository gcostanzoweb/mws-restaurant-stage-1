/* This file contains all the code necessary for the caching operations of
 * the service worker. The code is refactored starting from the base provided
 * by the course's lessons. */
var cacheName = 'restaurant-reviews-cache-v3';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll([
				'/',
				'/index.html',
				'/restaurant.html',
				'/restaurant.html?id=1',
				'/restaurant.html?id=2',
				'/restaurant.html?id=3',
				'/restaurant.html?id=4',
				'/restaurant.html?id=5',
				'/restaurant.html?id=6',
				'/restaurant.html?id=7',
				'/restaurant.html?id=8',
				'/restaurant.html?id=9',
				'/restaurant.html?id=10',
				'/js/dbhelper.js',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/css/styles.css',
				'/css/mobile-styles.css',
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
				'/data/restaurants.json',
				'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
				'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
				'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
				'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png'
			]);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('restaurant-reviews-cache-') &&
						cacheName != cacheName;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});