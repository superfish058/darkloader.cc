import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:'./',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "./src/style.scss";`,
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 要代理的域名
        changeOrigin: true, //允许跨域
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
