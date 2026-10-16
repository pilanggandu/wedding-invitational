import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "192.168.1.2",
    "192.168.1.2:3000",
    "100.119.19.25",
    "100.119.19.25:3000",
    "10.147.17.166",
    "10.147.17.166:3000",
    "*.trycloudflare.com",
    "*.loca.lt",
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
