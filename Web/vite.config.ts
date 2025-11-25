import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../.env') });

export default defineConfig(() => {
  const port = Number(process.env.Web_PORT) || 5000;

  return {
    plugins: [react()],
    server: {
      port: port,
    },
  };
});
