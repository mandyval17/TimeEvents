import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@utilities': '/src/utilities',
      '@services': '/src/services',
    }
  }
});
