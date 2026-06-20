import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5108,
    strictPort: true,
    open: true
  }
});