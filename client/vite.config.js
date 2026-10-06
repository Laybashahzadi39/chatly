import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    port: 5176,        // client hamesha isi port par chalega
    strictPort: true,  // port busy ho to doosra port na le, error de
  },
})
