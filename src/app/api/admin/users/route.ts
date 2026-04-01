import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth"; // เปลี่ยนมาใช้ตัวนี้

export async function GET(req: Request) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  const allowedRoles = ["super_admin", "admin", "hr", "director", "deputy_resource", "editor", "staff"];

  if (!session || !allowedRoles.includes(userRole)) {
    return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20"); // Adjusted back to 20 for "Load More"
    const search = searchParams.get("search") || "";

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } }
      ];
    }

    const total = await db.collection("users").countDocuments(query);
    const users = await db
      .collection("users")
      .find(query)
      .sort({ orderIndex: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({ password: 0 })
      .toArray();

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      hasMore: total > page * limit
    });
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json({ error: "Database Error" }, { status: 500 });
  }
}
