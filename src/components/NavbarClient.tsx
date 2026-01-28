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
        {/* --- LOGO --- */}
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
          <span className="hidden sm:block text-zinc-800 dark:text-white font-extrabold tracking-tighter text-xl">
            KTLTC
          </span>
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* --- AUTH SECTION & THEME TOGGLE --- */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {username ? (
            <div
              className="relative"
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <button className="flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                    {role?.replace("_", " ") || "Member"}
                  </div>
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                    {username}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                  {username.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* ✅ แก้ไขตรงนี้: ใช้ pt-2 เพื่อเชื่อมช่องว่าง และย้าย style กล่องไปไว้ข้างใน */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full pt-2 w-64 animate-in fade-in zoom-in-95 duration-200">
                  {/* กล่องเนื้อหาจริงย้ายมาตรงนี้ */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {username}
                      </p>
                    </div>

                    <div className="p-2 space-y-1">
                      {role === "super_admin" && (
                        <Link
                          href="/dashboard/super-admin"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        >
                          <span>⚡</span> Super Admin Console
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <span>🏠</span> Dashboard
                      </Link>

                      <div className="border-t border-zinc-100 dark:border-zinc-800 mt-2 pt-2">
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

        <MobileMenu menuTree={menuTree} />
      </div>
    </nav>
  );
}
