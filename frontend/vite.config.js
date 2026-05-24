import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  // 1. Force Vite to look inside the 'frontend' directory for index.html
  root: path.resolve(__dirname),
  
  plugins: [tailwindcss(),react()],
  
 build: {
    // This tells Vite to output the final build directly into frontend/dist
    outDir: 'dist',
    emptyOutDir: true,
  }
})