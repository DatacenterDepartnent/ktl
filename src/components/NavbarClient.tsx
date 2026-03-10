"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { NavItem } from "@/types/nav";
import ThemeToggle from "./ThemeToggle";
import LogoutBtn from "./LogoutBtn";

type MenuItem = NavItem & {
  children?: MenuItem[];
};

interface NavbarClientProps {
  menuTree: MenuItem[];
  username?: string;
  role?: string;
  image?: string;
}

export default function NavbarClient({
  menuTree,
  username,
  role,
  image,
}: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b ${
        isScrolled
          ? "py-2 bg-white/95 dark:bg-zinc-950/95 shadow-md border-zinc-200 dark:border-zinc-800 backdrop-blur-md"
          : "py-4 bg-white/50 dark:bg-zinc-950/50 shadow-none border-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* --- 1. LOGO --- */}
        <Link
          href="/"
          className={`font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition-transform duration-300 ${
            isScrolled ? "scale-90" : "scale-100"
          }`}
        >
          <Image
            src="/images/favicon.ico"
            alt="KTL Logo"
            width={44}
            height={44}
            priority
            className="w-10 h-10 md:w-11 md:h-11"
          />
          <span className="text-zinc-800 dark:text-white font-extrabold tracking-tighter text-xl">
            KTLTC
          </span>
        </Link>

        {/* --- 2. DESKTOP MENU --- */}
        <div className="hidden xl:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition"
          >
            หน้าแรก
          </Link>
          {menuTree.map((item) => (
            <div
              key={item._id}
              className="relative group flex items-center h-full py-2"
            >
              <Link
                href={item.path || "#"}
                className="flex items-center gap-1 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        {/* --- 3. RIGHT ACTIONS --- */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          <div className="hidden xl:flex items-center gap-4">
            {username ? (
              <div
                className="relative shrink-0"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button className="group flex items-center gap-3 p-1.5 pr-4 rounded-full bg-zinc-100/80 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition-all border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm hover:shadow-md">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-sm opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white border border-white/20 shadow-inner">
                      {image ? (
                        <Image
                          src={image}
                          alt={username}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover shadow-sm"
                        />
                      ) : (
                        <span className="text-[13px] font-black uppercase">
                          {username.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left hidden sm:block">
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-blue-600 dark:text-blue-400 mb-0.5 leading-none">
                      {role || "member"}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 leading-none">
                        {username.split(" ")[0]}
                      </p>
                      <svg
                        className="w-3.5 h-3.5 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full pt-3 w-64 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-2">
                      <div className="px-4 py-4 mb-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
                          Authenticated as
                        </p>
                        <p className="text-[15px] font-black text-zinc-900 dark:text-white leading-tight truncate">
                          {username}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 rounded-xl transition-all"
                        >
                          <span className="text-lg">🚀</span> ไปที่ Dashboard
                        </Link>

                        {/* ✅ แก้ไข Path เป็น /dashboard/super-admin ตามที่คุณต้องการ */}
                        {role === "super_admin" && (
                          <>
                            {/* <Link
                              href="/admin/navbar"
                              className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all"
                            >
                              <span className="text-lg">📋</span> จัดการเมนูหลัก
                            </Link> */}
                            <Link
                              href="/dashboard/super-admin"
                              className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-xl transition-all"
                            >
                              <span className="text-lg">🛡️</span> ระบบจัดการ
                              Super Admin
                            </Link>
                          </>
                        )}

                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 rounded-xl transition-all"
                        >
                          <span className="text-lg">👤</span> จัดการโปรไฟล์
                        </Link>

                        <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800">
                          <LogoutBtn />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md transition hover:scale-105 active:scale-95"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>

          {/* หาบรรทัดนี้ใน NavbarClient.tsx แล้วเพิ่ม image={image} */}
          <div className="xl:hidden">
            <MobileMenu menuTree={menuTree} image={image} />
          </div>
        </div>
      </div>
    </nav>
  );
}
