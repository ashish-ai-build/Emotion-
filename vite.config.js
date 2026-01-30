import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    // Only use base path for GitHub Pages deployment
    base: process.env.GITHUB_ACTIONS === 'true' ? '/Emotion-/' : '/',
  }
})
