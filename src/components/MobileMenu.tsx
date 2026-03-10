"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ เพิ่ม import Image
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/nav";
import ThemeToggle from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";

type MenuItem = NavItem & {
  children?: MenuItem[];
};

export default function MobileMenu({
  menuTree = [],
  image, // ✅ รับ Prop image เพิ่มเข้ามา
}: {
  menuTree?: MenuItem[];
  image?: string; // ✅ กำหนด Type
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const user = session?.user;
  const userRole = (user as any)?.role?.toLowerCase() || "";
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSubMenuId(null);
  };

  const toggleSubMenu = (id: string) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);
  };

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
    <div className="xl:hidden">
      {/* ปุ่ม Hamburger (เหมือนเดิม) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors focus:outline-none ${
          isOpen
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
        }`}
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

      {isOpen && (
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] z-[9999]">
          <div className="w-full h-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 overflow-y-auto pb-24 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col p-4 space-y-3">
              {/* ... ส่วนเมนูหลัก (ข้ามไปส่วน User Profile ด้านล่าง) ... */}
              <Link
                href="/"
                onClick={closeMenu}
                className={`block w-full p-4 rounded-xl font-bold text-lg transition-all shadow-sm ${pathname === "/" ? "bg-blue-600 text-white shadow-blue-500/30" : "bg-zinc-50 text-zinc-800 border border-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800"}`}
              >
                หน้าแรก
              </Link>

              {safeMenuTree.map((item) => (
                <div
                  key={item._id}
                  className={`flex flex-col rounded-xl border overflow-hidden transition-colors ${openSubMenuId === item._id ? "bg-blue-50/30 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30" : "bg-zinc-50 border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"}`}
                >
                  {/* Logic เมนูวนลูปคงเดิม */}
                  <Link
                    href={item.path}
                    onClick={closeMenu}
                    className="p-4 font-bold text-base"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}

              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mt-2">
                <span className="font-bold text-zinc-700 dark:text-zinc-200">
                  โหมดแสดงผล
                </span>
                <ThemeToggle />
              </div>

              {/* ✅ ส่วนจัดการสมาชิก - แก้ไขให้แสดงรูปภาพจริง */}
              <div className="pt-4 pb-8 space-y-3 border-t border-zinc-100 dark:border-zinc-800 mt-4">
                {status === "loading" ? (
                  <div className="text-center py-4 text-zinc-500">
                    กำลังโหลด...
                  </div>
                ) : user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3 px-4 mb-2">
                      {/* 📸 ส่วนของรูปภาพโปรไฟล์ */}
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white border-2 border-white dark:border-zinc-800 shadow-md shrink-0">
                        {image ? (
                          <Image
                            src={image}
                            alt={user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="font-bold text-xl uppercase">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-800 dark:text-white text-lg leading-none mb-1">
                          {user?.name || (user as any)?.username || "ผู้ใช้งาน"}
                        </span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">
                          {(user as any)?.role?.replace("_", " ") || "Member"}
                        </span>
                      </div>
                    </div>

                    {/* เมนูต่าง ๆ */}
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="mx-1 block text-center py-3.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 transition-colors"
                    >
                      🚀 ไปที่ Dashboard
                    </Link>

                    {(userRole === "super_admin" || userRole === "admin") && (
                      <Link
                        href="/dashboard/super-admin"
                        onClick={closeMenu}
                        className="mx-1 block text-center py-3.5 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 transition-colors"
                      >
                        🛡️ ระบบจัดการ Super Admin
                      </Link>
                    )}

                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenu}
                      className="mx-1 block text-center py-3.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold dark:border-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      👤 จัดการโปรไฟล์
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mx-1 mt-2 block w-full text-center py-3.5 rounded-xl text-red-600 font-semibold hover:bg-red-50 dark:text-red-400 transition-colors"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="block w-full text-center py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-transform"
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
