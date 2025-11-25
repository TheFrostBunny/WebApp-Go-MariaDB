import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Last inn .env fra overmappen
dotenv.config({ path: join(__dirname, '../.env') });

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_Web_PORT) || 5000,
  },
  define: {
    'import.meta.env.VITE_Server_IP': JSON.stringify(process.env.VITE_Server_IP),
    'import.meta.env.VITE_Server_PORT': JSON.stringify(process.env.VITE_Server_PORT),
  },
});
