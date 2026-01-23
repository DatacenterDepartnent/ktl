import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typescript: {
  //   // ยอมให้ Build ผ่านแม้มี Error เพื่อความรวดเร็ว
  //   ignoreBuildErrors: true,
  // },
  
  // ✅ เพิ่มบรรทัดนี้ (หน่วยเป็นวินาที)
  staticPageGenerationTimeout: 180,

  images: {
    // รองรับไฟล์ภาพประสิทธิภาพสูง
    formats: ["image/avif", "image/webp"],
    // อนุญาตให้ดึงรูปภาพจาก Cloudinary มาแสดงผล
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  compress: true,
};

export default nextConfig;
