import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Separate heavy deps into their own chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Raise the chunk size warning threshold slightly (three.js is intentionally large)
    chunkSizeWarningLimit: 700,
  },
  // Prevent tiny assets from being inlined into JS (avoids bundle bloat)
  assetsInlineLimit: 4096,
})
