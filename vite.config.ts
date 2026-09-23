import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { copyFileSync, mkdirSync } from 'node:fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({ include: ['src'], exclude: ['src/tokens.css'], entryRoot: 'src' }),
    {
      name: 'copy-tokens-css',
      closeBundle() {
        mkdirSync(fileURLToPath(new URL('./dist', import.meta.url)), { recursive: true })
        copyFileSync(
          fileURLToPath(new URL('./src/tokens.css', import.meta.url)),
          fileURLToPath(new URL('./dist/tokens.css', import.meta.url)),
        )
      },
    },
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'chalk-glass.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
    },
  },
})
