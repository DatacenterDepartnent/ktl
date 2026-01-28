"use client";

import { useRouter } from "next/navigation";

export default function LogoutBtn() {
  const router = useRouter();

  const handleLogout = async () => {
    // ถามยืนยันก่อน
    if (!confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) return;

    try {
      // เรียก API เพื่อลบ Cookie ฝั่ง Server
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        // 1. รีเฟรชเพื่อล้าง Cache ข้อมูลเก่า
        router.refresh();

        // 2. ✅ ดีดกลับไปหน้า Login (ไม่ใช่หน้าแรก) เพื่อให้ User รู้ว่าออกแล้วจริงๆ
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white px-4 py-2 rounded-xl transition-all font-bold border border-red-600/20 active:scale-95 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-600 dark:hover:text-white"
    >
      <span className="text-lg">🚪</span>
      <span>ออกจากระบบ</span>
    </button>
  );
}
