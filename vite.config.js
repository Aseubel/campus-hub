import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // host: "0.0.0.0",
    port: 2611,
    proxy: {
      "/api": {
        target: "http://localhost:611",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  base: "./", // 静态资源相对路径
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
    // 调整块大小警告的限制（单位为 KB）
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // 手动控制代码分块
        manualChunks: {
          // 将 node_modules 中的代码分割成单独的块
          vendor: ["vue", "vue-router", "pinia", "axios", "element-plus"],
          // 可以根据需要添加更多的分块
          echarts: ["echarts"],
        },
      },
    },
  },
})
