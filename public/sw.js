self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  return self.clients.claim();
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
      body: data.body,
      icon: '/icon.png',
      badge: '/badge.png',
      actions: [
          {
              action: 'add_record',
              title: 'Add Record'
          }
      ]
  };
  event.waitUntil(
      self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  const action = event.action;
  let urlToOpen = '/';

  switch (action) {
      case 'add_record':
          urlToOpen = '/tools/tracking'; 
          break;
      default:
          urlToOpen = '/';
  }

  event.waitUntil(
      self.clients.openWindow(urlToOpen)
  );
});
