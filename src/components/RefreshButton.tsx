"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);

    // startTransition จะช่วยให้ UI ไม่ค้างระหว่างรอ Server ตอบกลับ
    startTransition(() => {
      router.refresh(); // สั่งให้ Server Component โหลดข้อมูลใหม่
    });

    // ตั้งเวลาให้หยุดหมุน (เพื่อให้ User รู้สึกว่ากดติด)
    setTimeout(() => setIsSpinning(false), 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="group flex items-center gap-2 px-4 py-2  border border-slate-200 shadow-sm rounded-full text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <svg
        className={`w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-transform duration-700 ${
          isSpinning || isPending ? "animate-spin" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {isPending ? "กำลังอัปเดต..." : "รีเฟรชข้อมูล"}
    </button>
  );
}
