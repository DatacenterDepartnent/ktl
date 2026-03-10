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
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }, // ✅ ดีมากครับ ช่วยลด Data Payload
    );

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
  // ดึงชื่อจาก session หรือ fallback ไปที่ name ใน body
  const sessionUserName = session?.user?.name;

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

    let logDetail = "อัปเดตข้อมูลส่วนตัว";

    // ✅ 1. ตรวจสอบและอัปโหลดรูป (ปรับให้เร็วขึ้นด้วย Eager Transformation)
    if (image && image.startsWith("data:image")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "user_profiles",
          transformation: [
            { width: 200, height: 200, crop: "fill", gravity: "face" },
          ], // ✅ ลดขนาดรูปตั้งแต่ตอนอัปโหลด ช่วย FCP/LCP
        });
        updateData.image = uploadResponse.secure_url;
        logDetail = "อัปเดตโปรไฟล์และเปลี่ยนรูปภาพใหม่";
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

    // ✅ 4. บันทึก Log กิจกรรม (ใช้ชื่อที่อัปเดตใหม่เพื่อให้หน้า Log แสดงผลถูกต้อง)
    try {
      await db.collection("logs").insertOne({
        userId: new ObjectId(userId),
        userName: name || sessionUserName || "User", // ✅ ใช้ name ล่าสุดที่เพิ่งแก้
        action: "UPDATE_PROFILE",
        details: logDetail,
        timestamp: new Date(),
        // ปรับการดึง IP ให้แม่นยำขึ้น
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1",
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
