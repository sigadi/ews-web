// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  async redirects() {
    return [];
  },
};

export default nextConfig;
