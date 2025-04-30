import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000', // Backend URL (changed to 9000)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase from 500 KB to 1000 KB
  },
  optimizeDeps: {
    exclude: [],
  },
});
