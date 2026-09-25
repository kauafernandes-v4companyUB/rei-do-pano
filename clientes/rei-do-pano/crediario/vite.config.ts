/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// NEXT_PUBLIC_* vem da integração Supabase da Vercel (só URL e chave pública).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  build: {
    target: 'es2020',
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'supabase/functions/_shared/**/*.test.ts'],
  },
});
