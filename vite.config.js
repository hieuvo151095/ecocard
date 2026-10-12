import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@design-system': path.resolve(__dirname, './Design System'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
  },
});
