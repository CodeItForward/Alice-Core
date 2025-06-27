import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''),
        secure: false,
        ws: true
      },
      '/api/student-profiles': {
        target: 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/student-profiles/, '/student-profiles'),
        secure: false
      },
      '/api/users': {
        target: 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '/users'),
        secure: false
      },
      '/api/teams': {
        target: 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/teams/, '/teams'),
        secure: false
      }
    }
  }
});
