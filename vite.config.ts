import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [
    react()
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    port: 6001,
    hmr: {
      overlay: false
    },
    allowedHosts: ['nmx2d2-6001.csb.app']
  },
  build: {
    outDir: 'dist',
    sourcemap: command === 'serve',
    minify: 'terser',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'utils': ['date-fns', 'lucide-react']
        }
      }
    }
  }
}));
