"use client"; // ✅ ต้องใส่บรรทัดนี้เสมอสำหรับ Client Component

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ViewAllButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.push("/news"); // สั่งให้เปลี่ยนหน้า
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md self-start md:self-center
        ${
          isPending
            ? "bg-orange-300 text-white cursor-wait" // สถานะกำลังโหลด (สีจางลง, เมาส์หมุน)
            : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200" // สถานะปกติ
        }
      `}
    >
      {isPending ? (
        // ✅ 1. แสดง Spinner ตอนกำลังโหลด
        <>
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          กำลังไป...
        </>
      ) : (
        // ✅ 2. แสดงปกติ
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          ดูข่าวทั้งหมด
        </>
      )}
    </button>
  );
}
