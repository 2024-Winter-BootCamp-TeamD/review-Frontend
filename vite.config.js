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
          src: "./extension/manifest.json",
          dest: "./dist",
        },
        {
          src: "./extension/icons/*",
          dest: "./dist/icons",
        },
        {
          src: "./extension/background.js",
          dest: "./dist",
        },
        {
          src: "./extension/content.js",
          dest: "./dist",
        },
        {
          src: "./extension/content.css", // content.css 추가
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
