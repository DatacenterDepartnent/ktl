import clientPromise from "@/lib/db";
import { NavItem } from "@/types/nav";
import NavbarClient from "./NavbarClient";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

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
  const menuTree = await getNavItems();
  const session = await auth();

  let userImage = "";
  let username = session?.user?.name || (session?.user as any)?.username || "";
  let role = ""; // เริ่มต้นเป็นค่าว่าง

  if (session?.user) {
    try {
      const userId = (session.user as any).id || (session as any).userId;

      if (userId && ObjectId.isValid(userId)) {
        const client = await clientPromise;
        const db = client.db("ktltc_db");
        const userData = await db
          .collection("users")
          .findOne({ _id: new ObjectId(userId) });

        if (userData) {
          userImage = userData.image || "";
          username = userData.name || userData.username || username;
          // ✅ บังคับเป็นตัวพิมพ์เล็กเพื่อให้ตรงกับ "super_admin" ใน DB
          role = (userData.role || "").trim().toLowerCase();
        }
      }
    } catch (error) {
      console.error("Fetch latest user data error:", error);
    }
  }

  return (
    <NavbarClient
      menuTree={menuTree}
      username={username}
      role={role}
      image={userImage}
    />
  );
}
