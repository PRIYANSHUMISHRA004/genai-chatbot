import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages:["@repo/ui","functions"]
};

export default nextConfig;
