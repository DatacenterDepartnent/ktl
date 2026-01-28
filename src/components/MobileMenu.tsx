"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/nav";
import ThemeToggle from "./ThemeToggle"; // ✅ Import ปุ่มสลับธีม

type MenuItem = NavItem & {
  children?: MenuItem[];
};

export default function MobileMenu({
  menuTree = [],
}: {
  menuTree?: MenuItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);
  const pathname = usePathname();

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
                    {/* ส่วนหัวเมนู (Parent Row) */}
                    {hasChildren ? (
                      // ✅ กรณีมีลูก: เป็นปุ่ม Toggle เต็มใบ
                      <button
                        onClick={() => toggleSubMenu(item._id || "")}
                        className="flex justify-between items-center w-full p-4 text-left font-bold text-base text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {/* ชื่อหัวข้อ */}
                        <span>{item.label}</span>

                        {/* ไอคอนลูกศร */}
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
                      // กรณีไม่มีลูก: เป็น Link ธรรมดา
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

                    {/* เมนูย่อย (Children) */}
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

              {/* ✅ ส่วนเลือกธีม (เพิ่มใหม่) */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mt-2">
                <span className="font-bold text-zinc-700 dark:text-zinc-200">
                  โหมดแสดงผล
                </span>
                <ThemeToggle />
              </div>

              {/* ปุ่ม Login */}
              <div className="pt-2 pb-8">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block w-full text-center py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                >
                  เข้าสู่ระบบ / Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
