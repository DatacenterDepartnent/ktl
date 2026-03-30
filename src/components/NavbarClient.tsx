"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { NavItem } from "@/types/nav";
import ThemeToggle from "./ThemeToggle";
import { signOut } from "next-auth/react";
import { FileText, Clock } from "lucide-react";

// กำหนด Type ให้รองรับ _id ที่บังคับใช้ใน MobileMenu
type MenuItem = NavItem & {
  _id: string;
  children?: MenuItem[];
};

interface NavbarClientProps {
  menuTree: MenuItem[];
  username?: string;
  role?: string;
  image?: string;
}

export default function NavbarClient({
  menuTree = [],
  username,
  role,
  image,
}: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();

  // จัดการรูปแบบชื่อ Role ให้สวยงาม
  const displayRole = role?.replace("_", " ").toUpperCase() || "MEMBER";
  const isAdmin =
    role?.toLowerCase() === "admin" || role?.toLowerCase() === "super_admin";
  const isSuperAdmin = role?.toLowerCase() === "super_admin";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const ensureAbsolute = (path: string) => {
    if (!path || path.startsWith("/") || path.startsWith("http") || path.startsWith("#")) return path;
    return `/${path}`;
  };

  const filteredMenuTree = menuTree.filter((item) => {
    const r = role?.toLowerCase();
    if (r === "user" || r === "teacher" || r === "janitor") {
      const restrictedPaths = [
        "/dashboard",
        "/attendance-dashboard",
        "/attendance-report",
        "/leave-approvals",
      ];
      return !restrictedPaths.some((p) => item.path?.startsWith(p));
    }
    return true;
  });

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "py-1 bg-white/90 dark:bg-zinc-950/90 shadow-sm border-zinc-200 dark:border-zinc-800 backdrop-blur-md"
          : "py-3 bg-white dark:bg-zinc-950 border-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between gap-2">
        {/* --- 1. LOGO --- */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/favicon.ico"
            alt="KTL Logo"
            width={38}
            height={38}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // ✅ เพิ่มบรรทัดนี้
            priority
          />
          <span className="text-zinc-900 dark:text-white font-black text-xl tracking-tighter uppercase italic ">
            KTL<span className="text-blue-600">TC</span>
          </span>
        </Link>

        {/* --- 2. DESKTOP MENU --- */}
        <div className="hidden xl:flex items-center gap-0.5">
          {filteredMenuTree.map((item) => (
            <div key={item._id} className="relative group">
              <Link
                href={ensureAbsolute(item.path) || "#"}
                className={`px-2.5 py-2 flex items-center gap-1 text-[16px] font-bold transition-all whitespace-nowrap ${
                  pathname === item.path
                    ? "text-blue-600"
                    : "text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600"
                }`}
              >
                {item.label}
                {item.children && item.children.length > 0 && (
                  <svg
                    className="w-3.5 h-3.5 opacity-40 group-hover:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </Link>

              {item.children && item.children.length > 0 && (
                <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl min-w-[220px] p-1.5 backdrop-blur-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child._id}
                        href={ensureAbsolute(child.path) || "#"}
                        className="block px-4 py-2.5 text-[14px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* --- 3. RIGHT ACTIONS --- */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />

          <div className="hidden xl:block w-px h-8 bg-zinc-200 dark:bg-zinc-800" />

          {username ? (
            <div
              className="relative"
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              {/* User Profile Button */}
              <button className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 shadow-sm">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 shadow-sm">
                  {image ? (
                    <Image
                      src={image}
                      alt={username}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // ✅ เพิ่มบรรทัดนี้
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold uppercase">
                      {username.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-left hidden lg:block overflow-hidden">
                  <p
                    className={`text-[10px] font-black uppercase leading-none mb-1 tracking-widest ${
                      isAdmin
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-emerald-600"
                    }`}
                  >
                    {displayRole}
                  </p>
                  <p className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[110px]">
                    {username}
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isUserDropdownOpen ? "rotate-180" : ""}`}
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

              {/* Enhanced Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full pt-2 w-56 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-60">
                  <div className="bg-white/80 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-y-auto max-h-[80vh] p-1.5 custom-scrollbar-thin">
                    <div className="px-3 py-2 mb-1 border-b border-zinc-100 dark:border-zinc-800/50">
                      <p className="text-[11px] text-zinc-400 font-medium">
                        จัดการบัญชี
                      </p>
                    </div>

                    {/* ✅ เมนูเฉพาะ Super Admin / Admin / Director / HR / Deputy */}
                    {(isSuperAdmin ||
                      role?.toLowerCase() === "admin" ||
                      role?.toLowerCase() === "hr" ||
                      role?.toLowerCase() === "director" ||
                      role?.toLowerCase() === "deputy_director") && (
                      <>
                        <div className="px-3 py-1">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest pl-1 mt-1 mb-1">
                            Attendance & HR
                          </p>
                        </div>
                        <Link
                          href="/attendance-dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all group"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                          เมนูภาพรวมการลงเวลา
                        </Link>
                        <Link
                          href="/attendance-report"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all group"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          ระบบรายงานการเข้างาน
                        </Link>
                        <Link
                          href="/work-reports"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all group"
                        >
                          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 transition-colors">
                            <FileText size={16} />
                          </div>
                          ระบบรายงานการทำงาน
                        </Link>
                        {(isSuperAdmin || 
                          role?.toLowerCase() === "hr" || 
                          role?.toLowerCase() === "director" || 
                          role?.toLowerCase() === "deputy_director") && (
                          <Link
                            href="/leave-approvals"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all group mb-1 border-b border-zinc-100 dark:border-zinc-800/50 pb-3"
                          >
                            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 transition-colors">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            จัดการอนุมัติใบลา
                          </Link>
                        )}
                        {(isSuperAdmin || role?.toLowerCase() === "hr") && (
                          <Link
                            href="/attendance-settings"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all group mb-1 border-b border-zinc-100 dark:border-zinc-800/50 pb-3"
                          >
                            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 transition-colors">
                              <Clock size={16} />
                            </div>
                            ตั้งค่าเวลาเข้างานตามตำแหน่ง
                          </Link>
                        )}
                      </>
                    )}

                    {/* ✅ เมนูเฉพาะ Super Admin */}
                    {isSuperAdmin && (
                      <>
                        <Link
                          href="/dashboard/super-admin"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all group"
                        >
                          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                          ระบบจัดการ Super Admin
                        </Link>
                        <Link
                          href="/dashboard/data-management"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all group"
                        >
                          <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 group-hover:bg-rose-200 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                              />
                            </svg>
                          </div>
                          🗄️ ระบบจัดการข้อมูลเรคคอร์ดทั้งหมด
                        </Link>
                        <Link
                          href="/work-reports-management"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all group"
                        >
                          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 transition-colors">
                            <FileText size={16} />
                          </div>
                          จัดการรายงานการทำงาน (Admin)
                        </Link>

                        <div className="my-1 border-t border-zinc-100 dark:border-zinc-800/50"></div>
                      </>
                    )}

                    {(isSuperAdmin ||
                      role?.toLowerCase() === "admin" ||
                      role?.toLowerCase() === "editor") && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all group"
                      >
                        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                          </svg>
                        </div>
                        Dashboard
                      </Link>
                    )}

                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all group"
                    >
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      โปรไฟล์ส่วนตัว
                    </Link>

                    <div className="my-1 border-t border-zinc-100 dark:border-zinc-800/50" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all group"
                    >
                      <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Sign In Button */
            <Link
              href="/login"
              className="relative overflow-hidden px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-bold transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 group"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>
          )}

          <div className="xl:hidden">
            <MobileMenu menuTree={filteredMenuTree} image={image} />
          </div>
        </div>
      </div>
    </nav>
  );
}

// ✅ Add custom styles for thin scrollbar in the dropdown
const customScrollbarStyles = `
  .custom-scrollbar-thin::-webkit-scrollbar {
    width: 5px;
  }
  .custom-scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar-thin::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  .dark .custom-scrollbar-thin::-webkit-scrollbar-thumb {
    background: #3f3f46;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('navbar-custom-styles')) {
  const style = document.createElement('style');
  style.id = 'navbar-custom-styles';
  style.innerHTML = customScrollbarStyles;
  document.head.appendChild(style);
}
