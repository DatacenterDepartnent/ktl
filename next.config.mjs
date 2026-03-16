/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. ปลดล็อกขนาดไฟล์สำหรับการอัปโหลด
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // 2. ป้องกันปัญหาเกี่ยวกับ Package ภายนอก
  serverExternalPackages: ["sharp", "mongodb"], // เพิ่ม mongodb เข้าไปด้วยเพื่อความชัวร์

  // 3. ตั้งค่ารูปภาพ
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  // 4. ข้ามการตรวจหา Error ตอน Build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 5. การตั้งค่าอื่นๆ
  compress: true,
  // แก้ไขตรงนี้: เพิ่มการจัดการหน้า Error
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
