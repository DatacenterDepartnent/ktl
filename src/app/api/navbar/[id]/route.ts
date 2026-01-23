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

    // เพิ่มการเช็คว่า ID ถูกต้องตาม format MongoDB หรือไม่ (Optional แต่แนะนำ)
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await db.collection("navbar").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error); // Log error ดูใน Server Terminal
    return NextResponse.json({ error: "Error deleting menu" }, { status: 500 });
  }
}
