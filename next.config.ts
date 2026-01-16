import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    // ✅ Autorise les quality utilisées dans ton code
    qualities: [65, 70, 75, 85, 90],

    // ✅ (optionnel mais recommandé) limite les tailles générées
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 500],

    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "media.discordapp.net" },
    ],
  },



  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
