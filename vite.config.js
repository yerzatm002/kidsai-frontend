import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "icons/apple-touch-icon.png"
      ],
      manifest: {
        name: "KidsAI",
        short_name: "KidsAI",
        description: "Платформа для изучения искусственного интеллекта для учеников 5–6 классов",
        theme_color: "#2F80ED",
        background_color: "#EAF6FF",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: "/offline.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/kidsai-backend\.onrender\.com\/api\/topics/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "kidsai-topics-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              networkTimeoutSeconds: 5
            }
          },
          {
            urlPattern: /^https:\/\/gvlzuczdoajpehicpmpt\.supabase\.co\/storage\/v1\/object\/public\/kidsai/i,
            handler: "CacheFirst",
            options: {
              cacheName: "kidsai-images-cache",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});