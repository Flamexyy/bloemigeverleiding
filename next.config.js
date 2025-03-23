/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
