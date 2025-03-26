/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
    domains: [
      'cdn.shopify.com',
      // Add any other domains you need for Image component
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  env: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  },
};

module.exports = nextConfig;
