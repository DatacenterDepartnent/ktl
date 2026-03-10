"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { NavItem } from "@/types/nav";
import ThemeToggle from "./ThemeToggle";
import LogoutBtn from "./LogoutBtn"; // อย่าลืม import ถ้ามี component นี้

type MenuItem = NavItem & {
  children?: MenuItem[];
};

interface NavbarClientProps {
  menuTree: MenuItem[];
  username?: string;
  role?: string;
}

export default function NavbarClient({
  menuTree,
  username,
  role,
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
        {/* --- 1. LOGO (ซ้าย) --- */}
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
          <span className="  text-zinc-800 dark:text-white font-extrabold tracking-tighter text-xl">
            KTLTC
          </span>
        </Link>

        {/* --- 2. DESKTOP MENU (กลาง - ซ่อนในมือถือ) --- */}
        <div className="hidden xl:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
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
                className="flex items-center gap-1 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
              >
                {item.label}
                {item.children && item.children.length > 0 && (
                  <svg
                    className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200"
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
                )}
              </Link>

              {item.children && item.children.length > 0 && (
                <div
                  className={`absolute left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 ${
                    isScrolled ? "top-8" : "top-10"
                  }`}
                >
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden min-w-[220px] py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child._id}
                        href={child.path}
                        className="block px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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

        {/* --- 3. RIGHT ACTIONS (ขวา) --- */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* ✅ Theme Toggle (แสดงทุกหน้าจอ) */}
          <ThemeToggle />

          {/* ✅ User Profile / Login Button (เฉพาะ Desktop) */}
          <div className="hidden xl:flex items-center gap-4">
            {username ? (
              <div
                className="relative shrink-0"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                {/* ปุ่ม User บน Navbar */}
                <button className="group flex items-center gap-3 p-1.5 pr-4 rounded-full bg-zinc-100/80 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition-all border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm hover:shadow-md">
                  {/* Avatar พร้อมวงแหวน Gradient */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-sm opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-[13px] font-black shadow-inner">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* User Info - แสดงชื่อจริงเด่นๆ */}
                  <div className="text-left hidden sm:block">
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-blue-600 dark:text-blue-400 mb-0.5 leading-none">
                      {role?.replace("_", " ") || "Member"}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 leading-none">
                        {/* ดึงเฉพาะชื่อแรกมาแสดง */}
                        {username.split(" ")[0]}
                      </p>
                      <svg
                        className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-500 transition-colors"
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

                {/* Dropdown Menu - แสดงชื่อเต็มที่นี่ */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full pt-3 w-64 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-2">
                      {/* Header แสดงชื่อ-นามสกุลเต็ม */}
                      <div className="px-4 py-4 mb-2 rounded-xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
                          Authenticated as
                        </p>
                        <p className="text-[15px] font-black text-zinc-900 dark:text-white leading-tight">
                          {username}
                        </p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1">
                          @{role?.toLowerCase().replace("_", "")}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all"
                        >
                          <span className="text-lg">🚀</span> ไปที่ Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all"
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
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md shadow-blue-500/20 transition hover:scale-105 active:scale-95"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>

          {/* ✅ Mobile Menu (Hamburger - เฉพาะ Mobile) */}
          <div className="xl:hidden">
            <MobileMenu menuTree={menuTree} />
          </div>
        </div>
      </div>
    </nav>
  );
}
