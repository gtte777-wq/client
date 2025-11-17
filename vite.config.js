// client/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url'; // 👈 새로운 모듈을 임포트합니다.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@' 별칭을 'src' 폴더로 설정합니다.
      // __dirname 대신 새로운 방식을 사용합니다.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // 🚨 React 개발 서버의 호스트 주소를 127.0.0.1로 고정하여
    // localhost:8080에 있는 Node.js 서버와 통신을 안정화합니다.
    host: '127.0.0.1', 
    port: 5173,
    // [선택 사항] 8080 서버로 API 요청을 프록시합니다. (현재는 불필요하지만 안정적)
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '/api'),
    //   },
    // },
  },
});