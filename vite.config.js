import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Set your custom port here
  }
})
// // vite.config.js
// export default {
//   server: {
//     port: 3001, // Set your custom port here
//   }
// };

