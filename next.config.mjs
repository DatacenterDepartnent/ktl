/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  serverExternalPackages: ["sharp", "mongodb"],

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ktltcv1.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ktltcv2.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ktltcv3.vercel.app",
        pathname: "/**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  compress: true,
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
