import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const mode = process.env.NODE_ENV;

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 8080,
    strictPort: true,
  },
  build: {
    minify: mode === "production" ? "terser" : false,
    sourcemap: mode !== "production",
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    origin: "http://localhost:5173",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
