import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Standalone gallery, rooted at `docs/`. It imports the kit from `../src`
 * exactly the way a consumer would import `@pravar/chalk-glass` — this
 * config exists only to serve `docs/index.html` and point the build's
 * output at `docs/dist` instead of the package's own `dist/`.
 */
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
  },
})
