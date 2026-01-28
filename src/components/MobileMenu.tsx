"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavItem } from "@/types/nav";
import ThemeToggle from "./ThemeToggle"; // ✅ Import ปุ่มสลับธีม

type MenuItem = NavItem & {
  children?: MenuItem[];
};

interface UserProfile {
  name: string;
  role: string;
  username: string;
}

export default function MobileMenu({
  menuTree = [],
}: {
  menuTree?: MenuItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null); // ✅ State เก็บข้อมูลผู้ใช้
  const pathname = usePathname();
  const router = useRouter();

  // 1. ตรวจสอบสถานะล็อกอินเมื่อโหลดหน้าเว็บ
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile"); // เรียก API Profile ที่เราทำไว้
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
      }
    };

    fetchUser();
  }, [pathname]); // เช็คใหม่ทุกครั้งที่เปลี่ยนหน้า (เผื่อ login/logout)

  // 2. ฟังก์ชันออกจากระบบ
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" }); // สมมติว่ามี API Logout
      if (res.ok) {
        setUser(null);
        router.push("/login");
        router.refresh();
      } else {
        // Fallback: ถ้าไม่มี API Logout ให้เคลียร์ cookie ฝั่ง client หรือ redirect
        // document.cookie = "token=; Max-Age=0; path=/;";
        window.location.href = "/login";
      }
    } catch (error) {
      window.location.href = "/login";
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSubMenuId(null);
  };

  const toggleSubMenu = (id: string) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);
  };

  // ล็อกการเลื่อนหน้าจอหลักเมื่อเปิดเมนู
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const safeMenuTree = menuTree || [];

  return (
    <div className="md:hidden">
      {/* ปุ่ม Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors focus:outline-none ${
          isOpen
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
        }`}
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* --- ส่วนเมนู (Overlay) --- */}
      {isOpen && (
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] z-[9999]">
          <div className="w-full h-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 overflow-y-auto pb-24 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col p-4 space-y-3">
              {/* ปุ่มหน้าแรก */}
              <Link
                href="/"
                onClick={closeMenu}
                className={`block w-full p-4 rounded-xl font-bold text-lg transition-all shadow-sm ${
                  pathname === "/"
                    ? "bg-blue-600 text-white shadow-blue-500/30"
                    : "bg-zinc-50 text-zinc-800 border border-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800"
                }`}
              >
                หน้าแรก
              </Link>

              {/* วนลูปเมนูหลัก */}
              {safeMenuTree.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive = openSubMenuId === item._id;

                return (
                  <div
                    key={item._id}
                    className={`flex flex-col rounded-xl border overflow-hidden transition-colors ${
                      isActive
                        ? "bg-blue-50/30 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30"
                        : "bg-zinc-50 border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"
                    }`}
                  >
                    {hasChildren ? (
                      <button
                        onClick={() => toggleSubMenu(item._id || "")}
                        className="flex justify-between items-center w-full p-4 text-left font-bold text-base text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${
                            isActive ? "rotate-180 text-blue-500" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={closeMenu}
                        className={`block w-full p-4 font-bold text-base transition-colors ${
                          pathname === item.path
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-zinc-700 dark:text-zinc-200"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* เมนูย่อย */}
                    {hasChildren && isActive && (
                      <div className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 animate-in slide-in-from-top-1 duration-200">
                        {item.children!.map((child: MenuItem) => (
                          <Link
                            key={child._id}
                            href={child.path}
                            onClick={closeMenu}
                            className={`flex items-center py-3.5 pl-8 pr-4 text-sm font-medium border-b last:border-0 border-zinc-50 dark:border-zinc-900 transition-colors ${
                              pathname === child.path
                                ? "text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-900/10"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-3 ${
                                pathname === child.path
                                  ? "bg-blue-500"
                                  : "bg-zinc-300 dark:bg-zinc-600"
                              }`}
                            ></span>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ส่วนเลือกธีม */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mt-2">
                <span className="font-bold text-zinc-700 dark:text-zinc-200">
                  โหมดแสดงผล
                </span>
                <ThemeToggle />
              </div>

              {/* ✅ ส่วนจัดการสมาชิก / เข้าสู่ระบบ (Dynamic) */}
              <div className="pt-4 pb-8 space-y-3 border-t border-zinc-100 dark:border-zinc-800 mt-4">
                {user ? (
                  // --- กรณีล็อกอินแล้ว ---
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3 px-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-800 dark:text-white text-lg">
                          {user.name}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="mx-1 block text-center py-3.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50 transition-colors"
                    >
                      🚀 ไปที่ Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenu}
                      className="mx-1 block text-center py-3.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                    >
                      👤 จัดการโปรไฟล์
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mx-1 mt-2 block w-full text-center py-3.5 rounded-xl text-red-600 font-semibold hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 transition-colors"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                ) : (
                  // --- กรณีไม่ได้ล็อกอิน ---
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="block w-full text-center py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-transform hover:shadow-blue-500/40"
                  >
                    เข้าสู่ระบบ / Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
