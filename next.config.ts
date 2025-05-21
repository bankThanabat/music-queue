import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.dummyimage.com',
      'i.ytimg.com',       // YouTube thumbnails
      'img.youtube.com',   // Alternative YouTube thumbnails
    ],
  },
};

export default nextConfig;
