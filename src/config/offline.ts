// Configurações para funcionalidade offline
export const OFFLINE_CONFIG = {
  // Versão do cache - incrementar quando houver mudanças importantes
  CACHE_VERSION: 'v1.0.0',
  
  // Nome dos caches
  CACHE_NAMES: {
    STATIC: 'sorteio-volei-static-v1',
    DYNAMIC: 'sorteio-volei-dynamic-v1',
    RUNTIME: 'sorteio-volei-runtime-v1'
  },
  
  // Recursos que devem ser sempre cacheados
  ESSENTIAL_RESOURCES: [
    '/',
    '/index.html',
    '/manifest.json'
  ],
  
  // Padrões de arquivos para cache automático
  CACHE_PATTERNS: {
    STATIC_ASSETS: [
      /\.js$/,
      /\.css$/,
      /\.woff2?$/,
      /\.png$/,
      /\.jpg$/,
      /\.jpeg$/,
      /\.svg$/,
      /\.ico$/
    ],
    API_ROUTES: [
      /\/api\//
    ]
  },
  
  // Configurações de tempo de cache
  CACHE_EXPIRY: {
    STATIC_ASSETS: 30 * 24 * 60 * 60 * 1000, // 30 dias
    API_RESPONSES: 5 * 60 * 1000, // 5 minutos
    DYNAMIC_CONTENT: 24 * 60 * 60 * 1000 // 1 dia
  },
  
  // Configurações de rede
  NETWORK_TIMEOUT: 3000, // 3 segundos
  
  // Estratégias de cache por tipo de recurso
  CACHE_STRATEGIES: {
    STATIC_ASSETS: 'CacheFirst',
    HTML_PAGES: 'NetworkFirst',
    API_CALLS: 'NetworkFirst',
    IMAGES: 'CacheFirst',
    FONTS: 'CacheFirst'
  }
};

// Utilitários para verificação offline
export const OFFLINE_UTILS = {
  // Verifica se o navegador suporta Service Worker
  isServiceWorkerSupported: (): boolean => {
    return 'serviceWorker' in navigator;
  },
  
  // Verifica se está online
  isOnline: (): boolean => {
    return navigator.onLine;
  },
  
  // Verifica se pode instalar como PWA
  canInstallPWA: (): boolean => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },
  
  // Verifica se está rodando como PWA instalada
  isRunningAsPWA: (): boolean => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  },
  
  // Estima o tamanho do cache
  estimateCacheSize: async (): Promise<number> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  },
  
  // Limpa caches antigos
  clearOldCaches: async (): Promise<void> => {
    const cacheNames = await caches.keys();
    const currentCaches = Object.values(OFFLINE_CONFIG.CACHE_NAMES);
    
    await Promise.all(
      cacheNames
        .filter(cacheName => !currentCaches.includes(cacheName))
        .map(cacheName => caches.delete(cacheName))
    );
  }
};

// Mensagens para o usuário
export const OFFLINE_MESSAGES = {
  GOING_OFFLINE: 'Você está offline. O aplicativo continuará funcionando com os dados salvos.',
  BACK_ONLINE: 'Conexão restaurada! Sincronizando dados...',
  CACHE_READY: 'Aplicativo pronto para funcionar offline.',
  UPDATE_AVAILABLE: 'Nova versão disponível. Clique para atualizar.',
  INSTALL_PROMPT: 'Instalar aplicativo no seu dispositivo?',
  INSTALL_SUCCESS: 'Aplicativo instalado com sucesso!',
  CACHE_ERROR: 'Erro ao preparar modo offline. Algumas funcionalidades podem não estar disponíveis.',
  NETWORK_ERROR: 'Erro de conexão. Verificando cache local...'
};