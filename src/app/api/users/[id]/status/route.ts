import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

// ✅ PATCH: แก้ไขข้อมูลผู้ใช้ (Approve / Change Role) - (อันเดิมของคุณ)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isActive, role } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const updateData: any = { updatedAt: new Date() };
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (role) updateData.role = role;

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE: ลบผู้ใช้ (เพิ่มส่วนนี้เข้าไปต่อท้ายไฟล์เดิม)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ลบข้อมูลออกจากฐานข้อมูล
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
