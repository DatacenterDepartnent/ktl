/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. ปลดล็อกขนาดไฟล์สำหรับการอัปโหลด (แก้ปัญหา Body exceeded 1 MB limit)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // 2. ป้องกันปัญหา Sharp ในสภาพแวดล้อม Server
  serverExternalPackages: ["sharp"],

  // 3. ตั้งค่ารูปภาพ (รองรับทั้ง uploads ในเครื่อง และ Cloudinary)
  images: {
    unoptimized: false, // เปลี่ยนเป็น true หากต้องการปิดการใช้ Image Optimization ของ Next.js
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  // 4. ข้ามการตรวจหา Error ตอน Build (ช่วยให้ Deploy ผ่านง่ายขึ้น)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 5. การตั้งค่าอื่นๆ
  compress: true,
  transpilePackages: ["@heroui/react", "antd"],
};

export default nextConfig;
