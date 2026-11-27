import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'recipes-catalog': ['./src/data/generatedRecipes.json']
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
});
