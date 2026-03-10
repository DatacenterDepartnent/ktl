/** @type {import('next').NextConfig} */
const nextConfig = {
  // ปิด Timeout เพื่อป้องกัน error จุกจิก
  staticPageGenerationTimeout: 1000,

  images: {
    // 🔥 ไม้ตาย: ปิดการ Optimize และการเช็ค Hostname ทั้งหมด
    // รูปจะแสดงผลได้ทันที 100% ไม่ว่า URL จะมาจากไหน
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  // การตั้งค่าอื่นๆ คงไว้
  compress: true,
  transpilePackages: ["@heroui/react", "antd"],
};

export default nextConfig;
