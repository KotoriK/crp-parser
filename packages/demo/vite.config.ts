import { defineConfig } from 'vite'

export default defineConfig({
  base: '/crp-parser/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
