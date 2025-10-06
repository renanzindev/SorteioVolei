import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Configurações para melhor cache e performance offline
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react']
        }
      }
    },
    // Gerar source maps para debugging
    sourcemap: true,
    // Otimizar para cache
    assetsInlineLimit: 4096
  },
  server: {
    // Headers para melhor cache durante desenvolvimento
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
});
