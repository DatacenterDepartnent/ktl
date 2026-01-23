import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: Request,
  // ✅ แก้ไข Type ตรงนี้ให้เป็น Promise
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // ✅ ต้อง await params ก่อนใช้งาน (ถูกต้องแล้ว)
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ตรวจสอบความถูกต้องของ ID ก่อนลบ (ป้องกัน Error ถ้า ID ผิด format)
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await db.collection("pages").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Page Error:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 },
    );
  }
}
