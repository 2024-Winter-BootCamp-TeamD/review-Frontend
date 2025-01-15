import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy"; // 추가

export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: "content.js", dest: "dist" }, // content.js를 dist 폴더로 복사
        { src: "manifest.json", dest: "dist" }, // manifest.json을 dist 폴더로 복사
        { src: "icons/*", dest: "dist/icons" }, // icons 폴더를 dist 폴더로 복사
      ],
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index.html", // 진입점 설정
        content: "./content.js", // content.js를 빌드에 포함
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  base: "./",
});
