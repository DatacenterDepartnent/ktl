import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // เตรียมข้อมูลที่จะอัปเดต
    const updateData: any = { ...body, updatedAt: new Date() };

    // 🔒 ถ้ามีการส่ง password มาใหม่ ให้ Hash ก่อนบันทึก
    if (body.password && body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateData.password = hashedPassword;
    } else {
      // ถ้าไม่ได้ส่งมา หรือส่งมาเป็นค่าว่าง ให้ลบออกจาก updateData (ใช้รหัสเดิม)
      delete updateData.password;
    }

    // ป้องกันไม่ให้แก้ _id
    delete updateData._id;

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({
      message: "Update success",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ... (ส่วน DELETE คงเดิม)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // (ใช้โค้ดเดิมจากขั้นตอนก่อนหน้าได้เลย)
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
