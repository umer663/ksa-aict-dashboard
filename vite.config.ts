// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   plugins: [react()],
//   base: mode === 'production' ? '/ksa-aict-dashboard/' : '/',
//   build: {
//     outDir: 'dist',
//     emptyOutDir: true,
//   }
// }))

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ksa-aict-dashboard/',   // 👈 your repo name
})

