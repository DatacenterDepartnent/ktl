import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// ✅ Config Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const userName = session?.user?.name;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, lineId, password, image } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const updateData: any = {
      name,
      email,
      phone,
      lineId,
      updatedAt: new Date(),
    };

    // ตัวแปรสำหรับเก็บรายละเอียด Log
    let logDetail = "อัปเดตข้อมูลส่วนตัว";

    // ✅ 1. ตรวจสอบและอัปโหลดรูปไปที่ Cloudinary
    if (image && image.startsWith("data:image")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "user_profiles",
        });
        updateData.image = uploadResponse.secure_url;
        logDetail = "อัปเดตโปรไฟล์และเปลี่ยนรูปภาพใหม่"; // ปรับรายละเอียด Log หากมีการเปลี่ยนรูป
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
      }
    }

    // ✅ 2. จัดการเรื่องรหัสผ่าน
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
      logDetail += " และเปลี่ยนรหัสผ่าน";
    }

    // ✅ 3. อัปเดตข้อมูลในคอลเลกชัน users
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

    // ✅ 4. เพิ่มการบันทึก Log กิจกรรม (เพื่อให้ไปโชว์ในหน้า Admin)
    try {
      await db.collection("logs").insertOne({
        userId: new ObjectId(userId),
        userName: userName || name || "User",
        action: "UPDATE_PROFILE",
        details: logDetail,
        timestamp: new Date(),
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });
    } catch (logError) {
      console.error("Failed to record profile update log:", logError);
    }

    return NextResponse.json({
      success: true,
      message: "อัปเดตข้อมูลสำเร็จ",
      imageUrl: updateData.image,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
