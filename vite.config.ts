import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const plugins = [
  react(),
  VitePWA({
    registerType: "autoUpdate",
    workbox: {
      maximumFileSizeToCacheInBytes: 2097152 * 2,
    },
  }),
];

export default defineConfig({
  build: {
    target: "es2021",
  },
  base: "/cashflow-projector",
  plugins,
});
