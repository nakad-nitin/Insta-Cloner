import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2048,
    outDir: "build",
    minify: "esbuild",
    manifest: true,
    sourcemap: true,
  },
});
