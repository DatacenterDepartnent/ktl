/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. เพิ่มการตั้งค่าเพื่อปลดล็อก Body Size (แก้ Error: Body exceeded 1 MB limit)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // อนุญาตให้อัปโหลดไฟล์ได้สูงสุด 10MB
    },
  },

  // 2. บอกให้ Next.js ปฏิบัติกับ sharp เป็น external package (ป้องกันปัญหาตอน build/run)
  serverExternalPackages: ["sharp"],

  staticPageGenerationTimeout: 1000,

  images: {
    unoptimized: false,
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  compress: true,
  transpilePackages: ["@heroui/react", "antd"],
};

export default nextConfig;
