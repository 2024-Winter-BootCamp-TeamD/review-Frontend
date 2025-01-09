import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // 익스텐션 파일이 출력될 폴더
    rollupOptions: {
      input: {
        popup: "index.html", // action에 사용할 HTML 파일
      },
    },
  },
});
