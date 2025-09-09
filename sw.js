const CACHE_NAME = 'breyerhub-v1.2.0';
const STATIC_CACHE = 'breyerhub-static-v1.2.0';
const DYNAMIC_CACHE = 'breyerhub-dynamic-v1.2.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/BreyerHub/',
  '/BreyerHub/index.html',
  '/BreyerHub/style.css',
  '/BreyerHub/script.js',
  '/BreyerHub/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Event - Cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Cache failed:', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch Event - Serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (except Font Awesome)
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise, fetch from network and cache if successful
        return fetch(event.request)
          .then(fetchResponse => {
            // Check if response is valid
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = fetchResponse.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(error => {
            console.log('Service Worker: Fetch failed, serving offline page');
            
            // Serve offline fallback for HTML pages
            if (event.request.destination === 'document') {
              return caches.match('/BreyerHub/index.html');
            }
            
            // For other resources, just fail gracefully
            throw error;
          });
      })
  );
});

// Background Sync for when connectivity is restored
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync any pending data when online
      syncPendingData()
    );
  }
});

// Push Event for notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Your study session is complete!',
    icon: '/BreyerHub/icons/icon-192x192.png',
    badge: '/BreyerHub/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'start-break',
        title: 'Start Break',
        icon: '/BreyerHub/icons/timer-shortcut.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/BreyerHub/icons/dismiss.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BreyerHub Study Timer', options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'start-break') {
    // Open the app and navigate to timer
    event.waitUntil(
      clients.openWindow('/BreyerHub/#timer')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/BreyerHub/')
    );
  }
});

// Helper function to sync pending data
async function syncPendingData() {
  try {
    // Check for any pending data in localStorage that needs to be synced
    console.log('Service Worker: Syncing pending data...');
    
    // This would typically sync data to a server
    // For now, we'll just log that sync is complete
    console.log('Service Worker: Data sync completed');
    
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Sync failed:', error);
    return Promise.reject(error);
  }
}

// Listen for messages from the main app
self.addEventListener('message', event => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'CACHE_UPDATE':
        // Force update cache
        caches.delete(STATIC_CACHE).then(() => {
          console.log('Service Worker: Cache updated');
        });
        break;
      default:
        console.log('Service Worker: Unknown message type');
    }
  }
});

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'study-reminder') {
    event.waitUntil(
      // Send study reminder notification
      self.registration.showNotification('BreyerHub Study Reminder', {
        body: 'Time for your next study session!',
        icon: '/BreyerHub/icons/icon-192x192.png',
        badge: '/BreyerHub/icons/icon-72x72.png',
        tag: 'study-reminder'
      })
    );
  }
});
