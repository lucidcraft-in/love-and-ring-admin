import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import crypto from "node:crypto";

const webcrypto = crypto.webcrypto;
const nodeCrypto = new Proxy(webcrypto || {}, {
  get(target, prop, receiver) {
    if (prop in target) {
      const val = Reflect.get(target, prop, receiver);
      return typeof val === "function" ? val.bind(target) : val;
    }
    if (prop in crypto) {
      const val = (crypto as any)[prop];
      return typeof val === "function" ? val.bind(crypto) : val;
    }
    return undefined;
  },
});

if (typeof globalThis.crypto === "undefined") {
  Object.defineProperty(globalThis, "crypto", {
    value: nodeCrypto,
    writable: true,
    configurable: true,
  });
}

if (typeof global.crypto === "undefined") {
  Object.defineProperty(global, "crypto", {
    value: nodeCrypto,
    writable: true,
    configurable: true,
  });
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      manifestFilename: "manifest.json",
      includeAssets: ["ring-logo.png", "robots.txt", "apple-touch-icon.png", "favicon.ico"],
      manifest: {
        name: "Love & Ring Admin Dashboard",
        short_name: "L&R Admin",
        description: "Admin & CRM Management Portal for Love & Ring Matrimony.",
        theme_color: "#1e293b",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "any",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}"]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
