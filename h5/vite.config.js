// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      '/api': {
        target: 'https://kaijiang.500.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // 处理重定向问题
        followRedirects: true,
        headers: {
          // 模拟浏览器请求头
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://kaijiang.500.com/'
        }
      }
    }
  }
})