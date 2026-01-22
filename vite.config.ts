import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@helpers": path.resolve(__dirname, "./src/helpers"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [react(), tailwindcss()],
});
