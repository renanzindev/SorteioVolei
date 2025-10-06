import { useEffect } from 'react';

export function useSilentOffline() {
  useEffect(() => {
    // Registrar Service Worker silenciosamente
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js');
          // Registrado silenciosamente, sem logs ou feedbacks
        } catch (error) {
          // Falha silenciosa
        }
      }
    };

    // Registrar na inicialização
    registerServiceWorker();

    // Listener para instalação PWA (silencioso)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Previne o prompt automático, mas não mostra nada
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
}