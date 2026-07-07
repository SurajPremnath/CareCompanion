import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: [
  "192.168.29.3",
  "*.trycloudflare.com",
],
};

export default nextConfig;
