"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutBtn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.refresh();
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full px-2">
      {" "}
      {/* Wrapper เพื่อจัดกึ่งกลาง */}
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
