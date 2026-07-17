import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true
  },
  build: {
    // Raise chunk warning threshold slightly since Three.js is legitimately large
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Three.js core + R3F into one named chunk — better caching
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-core';
          }
          // Framer Motion separate chunk
          if (id.includes('framer-motion')) {
            return 'framer';
          }
          // Lucide icons separate chunk
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          // Canvas confetti separate chunk (lazy-loaded)
          if (id.includes('canvas-confetti')) {
            return 'confetti';
          }
          // React vendor chunk for long-term caching
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
        }
      }
    }
  }
})
