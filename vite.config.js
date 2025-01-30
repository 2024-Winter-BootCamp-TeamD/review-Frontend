import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import copy from "rollup-plugin-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        {
          src: "./src/manifest.json",
          dest: "./dist",
        },
        {
          src: "./src/icons/*",
          dest: "./dist/icons",
        },
        {
          src: "./src/background.js",
          dest: "./dist",
        },
        {
          src: "./src/content.js",
          dest: "./dist",
        },
        {
          src: "./src/content.css", // content.css 추가
          dest: "./dist",
        },
        {
          src: "./src/popup.html", // content.css 추가
          dest: "./dist",
        },
        {
          src: "./src/popup.js", // content.css 추가
          dest: "./dist",
        },
        {
          src: "./src/popup.css", // content.css 추가
          dest: "./dist",
        },
      ],
      hook: "writeBundle",
      verbose: true,
    }),
  ],
  build: {
    outDir: "dist",
  },
});
