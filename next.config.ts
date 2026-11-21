import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "encrypted-tbn0.gstatic.com" },
    ],
  },
  experimental: {
    agentFeedback: true,
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
