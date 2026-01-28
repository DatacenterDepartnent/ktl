import clientPromise from "@/lib/db";
import { NavItem } from "@/types/nav"; // ตรวจสอบ path type ให้ตรงกับโปรเจกต์คุณ
import { cookies } from "next/headers";
import NavbarClient from "./NavbarClient";
import { jwtVerify } from "jose";

// Type สำหรับเมนูที่มีลูก (Dropdown)
export type MenuItem = NavItem & {
  children?: MenuItem[];
};

// ฟังก์ชันดึงข้อมูลเมนูจาก MongoDB
async function getNavItems() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const items = await db
      .collection("navbar")
      .find({})
      .sort({ order: 1 })
      .toArray();

    const allItems = JSON.parse(JSON.stringify(items)) as NavItem[];

    // จัดกลุ่ม Parent/Child
    const parents = allItems.filter((item) => !item.parentId);
    const menuTree = parents.map((parent) => {
      const children = allItems.filter(
        (child) => child.parentId === parent._id,
      );
      return { ...parent, children };
    }) as MenuItem[];

    return menuTree;
  } catch (error) {
    console.error("Failed to fetch nav items:", error);
    return [];
  }
}

export default async function Navbar() {
  // 1. ดึงข้อมูลเมนู
  const menuTree = await getNavItems();

  // 2. ดึง Cookie และแกะ Token
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let username: string | undefined = undefined;
  let role: string | undefined = undefined; // ตัวแปรสำหรับเก็บ Role

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "default_secret_key_change_me",
      );

      // แกะ Token ด้วย Jose
      const { payload } = await jwtVerify(token, secret);

      // ดึงข้อมูลออกมา
      if (payload.username) username = payload.username as string;
      if (payload.role) role = payload.role as string;
    } catch (error) {
      console.error("Token verification failed:", error);
      // ถ้า Token เสีย จะได้ค่า undefined กลับไปทั้งคู่
    }
  }

  // 3. ส่งข้อมูลทั้งหมดไปให้ NavbarClient แสดงผล
  return <NavbarClient menuTree={menuTree} username={username} role={role} />;
}
