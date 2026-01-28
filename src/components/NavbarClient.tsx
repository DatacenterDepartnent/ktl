"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { NavItem } from "@/types/nav";
import ThemeToggle from "./ThemeToggle";

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
        <nav className="... flex items-center justify-between ...">
          {/* 1. Logo */}

          {/* 2. Desktop Menu (Hidden on mobile) */}

          {/* 3. Right Actions Group */}
          <div className="flex items-center gap-4">
            {/* ✅ Theme Toggle: แสดงตลอดทั้ง Mobile และ Desktop */}
            <ThemeToggle />

            {/* ✅ User Profile: แสดงเฉพาะ Desktop */}
            <div className="hidden md:flex items-center gap-4"></div>

            {/* ✅ Mobile Menu: แสดงเฉพาะ Mobile */}
            <div className="md:hidden">
              <MobileMenu menuTree={menuTree} />
            </div>
          </div>
        </nav>
      </div>
    </nav>
  );
}
