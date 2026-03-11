import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// GET: ดึงข้อมูล
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // ✅ ถูกต้อง
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const banner = await db
      .collection("banners")
      .findOne({ _id: new ObjectId(id) });

    if (!banner)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

// PATCH: อัปเดตข้อมูล
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    // เพิ่มการเช็ค Role ตามความต้องการของคุณ
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // ✅ ถูกต้อง
    const body = await req.json();
    const { _id, ...updateData } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const result = await db
      .collection("banners")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}

// DELETE: ลบข้อมูล
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ✅ แก้ไข: ต้องเป็น Promise
) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ แก้ไข: ต้อง await params ก่อนนำ id มาใช้
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const result = await db
      .collection("banners")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
}
