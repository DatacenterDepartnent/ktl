"use client";

import { useState } from "react";
import { signOut } from "next-auth/react"; // ✅ ต้องใช้ตัวนี้เท่านั้น

export default function LogoutBtn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) return;

    setIsLoading(true);
    try {
      // ✅ signOut จะทำหน้าที่เรียก API, ล้าง Cookie และ Redirect ให้เองในคำสั่งเดียว
      await signOut({
        callbackUrl: "/login", // ออกแล้วให้ไปที่หน้า login
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // ถ้า Error จริงๆ ให้ใช้ Hard Reload ไปหน้า login
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full px-2">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="group flex items-center justify-center gap-2 w-full max-w-[200px] py-2.5 rounded-xl
                   bg-white dark:bg-zinc-900 
                   text-red-500 hover:text-white
                   border border-red-200 dark:border-red-900/30
                   hover:bg-red-500 hover:border-red-500
                   transition-all duration-300 font-bold active:scale-95 disabled:opacity-50
                   shadow-sm hover:shadow-red-500/20 hover:shadow-lg"
      >
        <span className="text-lg transition-transform group-hover:scale-110">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            "🚪"
          )}
        </span>
        <span className="text-sm">
          {isLoading ? "กำลังออก..." : "ออกจากระบบ"}
        </span>
      </button>
    </div>
  );
}
