const CACHE_NAME = 'sorteio-volei-v1';
const STATIC_CACHE_NAME = 'sorteio-volei-static-v1';

// Recursos essenciais para funcionamento offline
const ESSENTIAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/bola-de-voleibol.png'
];

// Recursos que serão cacheados dinamicamente
const DYNAMIC_CACHE_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.svg$/
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ESSENTIAL_RESOURCES);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch(() => {
        // Falha silenciosa
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Remove caches antigos
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Estratégia: Cache First para recursos estáticos
  if (isStaticResource(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Estratégia: Network First para HTML e API
  if (request.destination === 'document' || url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Estratégia padrão: Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// Verifica se é um recurso estático
function isStaticResource(url) {
  return DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

// Estratégia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Recurso não disponível offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Estratégia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página principal se for uma navegação
    if (request.destination === 'document') {
      const fallback = await caches.match('/index.html');
      if (fallback) {
        return fallback;
      }
    }
    
    return new Response('Página não disponível offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Silenciosamente falha se não há rede
    return null;
  });
  
  return cachedResponse || fetchPromise || new Response('Recurso não disponível', { 
    status: 503, 
    statusText: 'Service Unavailable' 
  });
}

// Listener para mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    caches.keys().then((cacheNames) => {
      event.ports[0].postMessage({
        type: 'CACHE_STATUS',
        caches: cacheNames,
        isOfflineReady: cacheNames.length > 0
      });
    });
  }
});