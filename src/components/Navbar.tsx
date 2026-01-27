import Link from "next/link";
import clientPromise from "@/lib/db";
import { NavItem } from "@/types/nav";
import { cookies } from "next/headers";
// 1. อย่าลืม Import MobileMenu เข้ามา
import MobileMenu from "./MobileMenu";
import Image from "next/image";

// สร้าง Type สำหรับเมนูที่มีลูก (ใช้แบบเดียวกับ MobileMenu เพื่อความชัวร์)
type MenuItem = NavItem & {
  children?: MenuItem[];
};

async function getNavItems() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ดึงข้อมูลเมนู
    const items = await db
      .collection("navbar")
      .find({})
      .sort({ order: 1 })
      .toArray();
    const allItems = JSON.parse(JSON.stringify(items)) as NavItem[];

    // จัดโครงสร้างแม่-ลูก
    const parents = allItems.filter((item) => !item.parentId);
    const menuTree = parents.map((parent) => {
      const children = allItems.filter(
        (child) => child.parentId === parent._id,
      );
      return { ...parent, children };
    }) as MenuItem[]; // บังคับ Type ให้ตรงกัน

    return menuTree;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Navbar() {
  const menuTree = await getNavItems();
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl    border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="font-black text-2xl tracking-tighter flex items-center gap-1"
        >
          <Image
            src="/images/favicon.ico"
            alt="KTL Logo"
            width={48}
            height={48}
          />
        </Link>

        {/* --- DESKTOP MENU (ซ่อนบนมือถือ md:flex) --- */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-bold  hover:text-sky-500 transition"
          >
            หน้าแรก
          </Link>
          {menuTree.map((item) => (
            <div
              key={item._id}
              className="relative group h-16 flex items-center"
            >
              <Link
                href={item.path}
                className="flex items-center gap-1 text-sm font-bold  hover:text-blue-400 transition cursor-pointer"
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
              {/* Dropdown Desktop */}
              {item.children && item.children.length > 0 && (
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden min-w-50 py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child._id}
                        href={child.path}
                        className="block px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
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

        {/* --- AUTH SECTION (ซ่อนบนมือถือ md:flex) --- */}
        {/* เราซ่อนส่วนนี้บนมือถือ แล้วไปแสดงใน MobileMenu แทน เพื่อไม่ให้รก */}
        <div className="hidden md:flex items-center gap-4">
          {username ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 hover:bg-white/5 px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold tracking-widest uppercase">
                  Admin
                </div>
                <div className="text-xs font-bold">{username}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        {/* --- 2. MOBILE MENU BUTTON (แสดงเฉพาะจอมือถือ) --- */}
        {/* ตรงนี้คือส่วนที่จะโชว์ปุ่ม 3 ขีดครับ */}
        <MobileMenu menuTree={menuTree} />
      </div>
    </nav>
  );
}
