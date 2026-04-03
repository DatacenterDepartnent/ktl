"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/nav";
import ThemeToggle from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { Clock, UserCog } from "lucide-react";

type MenuItem = NavItem & {
  children?: MenuItem[];
  _id: string; // ให้แน่ใจว่ามี _id สำหรับใช้เป็น key
};

export default function MobileMenu({
  menuTree = [],
  image,
}: {
  menuTree?: MenuItem[];
  image?: string;
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

  const ensureAbsolute = (path?: string) => {
    if (
      !path ||
      path.startsWith("/") ||
      path.startsWith("http") ||
      path.startsWith("#")
    )
      return path || "#";
    return `/${path}`;
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
      {/* ปุ่ม Hamburger */}
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
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] z-9999">
          <div className="w-full h-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 overflow-y-auto pb-24 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col p-2 space-y-3">
              <Link
                href="/"
                onClick={closeMenu}
                className={`block w-full p-4 rounded-xl font-bold text-lg transition-all shadow-sm ${pathname === "/" ? "bg-blue-600 text-white shadow-blue-500/30" : "bg-zinc-50 text-zinc-800 border border-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800"}`}
              >
                หน้าแรก
              </Link>

              {safeMenuTree.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isSubMenuOpen = openSubMenuId === item._id;

                return (
                  <div
                    key={item._id}
                    className={`flex flex-col rounded-xl border overflow-hidden transition-colors ${
                      isSubMenuOpen
                        ? "bg-blue-50/30 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30"
                        : "bg-zinc-50 border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"
                    }`}
                  >
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggleSubMenu(item._id)}
                          className="flex items-center justify-between p-4 font-bold text-base w-full text-left"
                        >
                          <span>{item.label}</span>
                          <svg
                            className={`w-5 h-5 transition-transform duration-200 ${
                              isSubMenuOpen
                                ? "rotate-180 text-blue-600 dark:text-blue-400"
                                : "text-zinc-500 dark:text-zinc-400"
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

                        {isSubMenuOpen && (
                          <div className="flex flex-col bg-white/50 dark:bg-black/20 border-t border-zinc-100 dark:border-zinc-800/50">
                            {item.children!.map((subItem) => (
                              <Link
                                key={subItem._id}
                                href={ensureAbsolute(subItem.path)}
                                onClick={closeMenu}
                                className="p-3 pl-8 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={ensureAbsolute(item.path)}
                        onClick={closeMenu}
                        className="p-4 font-bold text-base block w-full"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mt-2">
                <span className="font-bold text-sky-800 dark:text-sky-400">
                  โหมดแสดงผล
                </span>
                <ThemeToggle />
              </div>

              {/* Restore Member Management and Admin Sections */}
              {/* <div className="pt-4 pb-8 space-y-3 border-t border-zinc-100 dark:border-zinc-800 mt-4">
                {status === "loading" ? (
                  <div className="text-center py-4 text-zinc-500">
                    กำลังโหลด...
                  </div>
                ) : user ? (
                  <div className="flex flex-col space-y-3 px-1">
                    <div className="flex items-center gap-3 px-3 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white border-2 border-white dark:border-zinc-800 shadow-md shrink-0">
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


                   // 1. Dashboard (General for Admin/Editor) 
                    {(userRole === "super_admin" ||
                      userRole === "admin" ||
                      userRole === "editor") && (
                      <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className="mx-1 block text-center py-3.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 transition-colors mb-2"
                      >
                        🚀 ไปที่ Dashboard
                      </Link>
                    )}

                   2. Systems Control Section 
                    {(userRole === "super_admin" ||
                      userRole === "admin" ||
                      userRole === "hr" ||
                      userRole === "director" ||
                      [
                        "deputy_resource",
                        "deputy_strategy",
                        "deputy_academic",
                        "deputy_student_affairs",
                      ].includes(userRole)) && (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/attendance-dashboard"
                          onClick={closeMenu}
                          className="mx-1 block text-center py-3.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 transition-colors"
                        >
                          📊 เมนูภาพรวมการลงเวลา
                        </Link>

                        {(userRole === "super_admin" ||
                          userRole === "hr" ||
                          userRole === "director" ||
                          userRole === "deputy_resource") && (
                          <>
                            <Link
                              href="/attendance-report"
                              onClick={closeMenu}
                              className="mx-1 block text-center py-3.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 transition-colors"
                            >
                              📋 ระบบรายงานการเข้างาน
                            </Link>
                            <Link
                              href="/work-reports"
                              onClick={closeMenu}
                              className="mx-1 block text-center py-3.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 transition-colors"
                            >
                              📝 ระบบรายงานการปฏิบัติงาน
                            </Link>
                            <Link
                              href="/leave-approvals"
                              onClick={closeMenu}
                              className="mx-1 block text-center py-3.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 transition-colors"
                            >
                              ✅ จัดการอนุมัติใบลา
                            </Link>
                          </>
                        )}

                        {(userRole === "super_admin" ||
                          userRole === "hr" ||
                          userRole === "deputy_resource") && (
                          <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                            <Link
                              href="/manage-roles"
                              onClick={closeMenu}
                              className="mx-1 block text-center py-3.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 transition-colors"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <UserCog size={18} />
                                จัดการสิทธิ์บุคลากร
                              </div>
                            </Link>
                            <Link
                              href="/attendance-settings"
                              onClick={closeMenu}
                              className="mx-1 block text-center py-3.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 transition-colors"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Clock size={18} />
                                ตั้งค่าเวลาเข้างานตามตำแหน่ง
                              </div>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                   3. Super Admin Specialized Systems 
                    {userRole === "super_admin" && (
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t-2 border-zinc-100 dark:border-zinc-800">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center mb-1">
                          🛡️ Super Admin Control
                        </p>
                        <Link
                          href="/dashboard/super-admin"
                          onClick={closeMenu}
                          className="mx-1 block text-center py-3.5 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 transition-colors"
                        >
                          ระบบจัดการบัญชีผู้ใช้
                        </Link>
                        <Link
                          href="/dashboard/data-management"
                          onClick={closeMenu}
                          className="mx-1 block text-center py-3.5 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 transition-colors"
                        >
                          จัดการข้อมูลเรคคอร์ดทั้งหมด
                        </Link>
                      </div>
                    )}

                    <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />

                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenu}
                      className="mx-1 block text-center py-3.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold dark:border-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      👤 จัดการโปรไฟล์
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mx-1 mt-1 block w-full text-center py-3.5 rounded-xl text-red-600 font-semibold hover:bg-red-50 dark:text-red-400 transition-colors"
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
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
