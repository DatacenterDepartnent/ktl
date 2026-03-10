import clientPromise from "@/lib/db";
import { NavItem } from "@/types/nav";
import NavbarClient from "./NavbarClient";
import { auth } from "@/lib/auth"; // ✅ Import auth จากที่คุณตั้งค่าไว้

export type MenuItem = NavItem & {
  children?: MenuItem[];
};

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
  // 1. ดึงเมนูจาก DB
  const menuTree = await getNavItems();

  // 2. ดึง Session จาก NextAuth (ทำงานฝั่ง Server)
  const session = await auth();

  // เตรียมค่าส่งไปให้ NavbarClient
  // ใช้ session.user.name หรือ (session.user as any).username ตามที่คุณเก็บ
  const username = session?.user?.name || (session?.user as any)?.username;
  const role = (session?.user as any)?.role;

  // 3. ส่งข้อมูลไปที่ NavbarClient
  return <NavbarClient menuTree={menuTree} username={username} role={role} />;
}
