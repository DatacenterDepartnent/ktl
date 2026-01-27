"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/nav";

// Type definition
type MenuItem = NavItem & {
  children?: MenuItem[];
};

// ✅ แก้ไขบรรทัดนี้: เพิ่ม = [] เพื่อเป็นค่าเริ่มต้น และเครื่องหมาย ? เพื่อบอกว่าอาจไม่มีค่าส่งมา
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

  // ✅ เพิ่ม Safety Check: ถ้า menuTree ยังโหลดไม่เสร็จ หรือเป็น null ให้ใช้ [] แทน
  const safeMenuTree = menuTree || [];

  return (
    <div className="md:hidden">
      {/* ปุ่ม Hamburger / Close */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-300 hover:text-white focus:outline-none"
      >
        {isOpen ? (
          <svg
            className="w-8 h-8"
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
            className="w-8 h-8"
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

      {/* --- ส่วนเมนูที่เลื่อนลงมา --- */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full  border-b border-zinc-200 shadow-xl z-50 overflow-y-auto max-h-[80vh]">
          <div className="flex flex-col p-4 space-y-2">
            {/* เมนูหน้าแรก */}
            <Link
              href="/"
              onClick={closeMenu}
              className={`p-3 rounded-lg font-bold transition-colors ${
                pathname === "/"
                  ? "bg-blue-600 text-white"
                  : "text-black hover:bg-zinc-100"
              }`}
            >
              หน้าแรก
            </Link>

            {/* ✅ ใช้ safeMenuTree แทน menuTree ป้องกันการ map ค่าว่าง */}
            {safeMenuTree.map((item) => (
              <div key={item._id} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <Link
                    href={item.path}
                    onClick={closeMenu}
                    className="flex-1 p-3 rounded-lg font-bold text-black hover:bg-zinc-100 transition-colors"
                  >
                    {item.label}
                  </Link>

                  {/* ปุ่มลูกศร */}
                  {item.children && item.children.length > 0 && (
                    <button
                      onClick={() => toggleSubMenu(item._id || "")}
                      className="p-3 text-black hover:bg-zinc-100 rounded-lg"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          openSubMenuId === item._id ? "rotate-180" : ""
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
                  )}
                </div>

                {/* เมนูย่อย */}
                {item.children &&
                  item.children.length > 0 &&
                  openSubMenuId === item._id && (
                    <div className="ml-4 pl-4 border-l-2 border-zinc-200 space-y-1 mb-2">
                      {item.children.map((child: MenuItem) => (
                        <Link
                          key={child._id}
                          href={child.path}
                          onClick={closeMenu}
                          className="block p-2 text-sm text-black hover:bg-zinc-100 rounded transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* ปุ่ม Login/Admin */}
            <div className="pt-4 mt-2 border-t border-zinc-200">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block w-full text-center py-3 rounded-xl bg-zinc-100 text-black font-bold hover:bg-zinc-200 transition-colors"
              >
                เข้าสู่ระบบ / Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
