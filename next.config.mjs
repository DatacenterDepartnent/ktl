/** @type {import('next').NextConfig} */
const nextConfig = {
  // ปิด Timeout เพื่อป้องกัน error จุกจิก
  staticPageGenerationTimeout: 1000,

  images: {
    unoptimized: false, // แนะนำให้เปิดไว้เพื่อให้เว็บโหลดเร็ว (LCP ดีขึ้น)
    qualities: [75, 85], // เพิ่มบรรทัดนี้เพื่อลบ Warning ใน Log
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
