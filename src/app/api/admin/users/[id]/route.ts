import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs"; // อย่าลืม npm install bcryptjs
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      logAction,
      logDetails,
      adminId,
      adminName,
      password,
      ...updateData
    } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // เตรียมข้อมูลสำหรับอัปเดต
    const updatePayload: any = { ...updateData, updatedAt: new Date() };

    // ถ้ามีการส่งรหัสผ่านใหม่มา ให้เข้ารหัสก่อน
    if (password && password.length >= 6) {
      updatePayload.password = await bcrypt.hash(password, 10);
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatePayload });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // บันทึก Log
    if (logAction) {
      await db.collection("logs").insertOne({
        adminId: adminId ? new ObjectId(adminId) : null,
        adminName: adminName || "System",
        action: logAction,
        details: password ? `${logDetails} (มีการเปลี่ยนรหัสผ่าน)` : logDetails,
        targetId: new ObjectId(id),
        timestamp: new Date(),
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
