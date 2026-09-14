import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import symfonyPlugin from 'vite-plugin-symfony';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    symfonyPlugin(),
  ],

  base: '/build/',

  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    cors: {
      origin: 'http://127.0.0.1:8000',
    },
  },

  build: {
    outDir: fileURLToPath(
      new URL('../backend/public/build/', import.meta.url)
    ),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        app: fileURLToPath(
          new URL('./src/main.jsx', import.meta.url)
        ),
      },
    },
  },
});