import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp"; // 👈 นำเข้า Sharp

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (
      !session ||
      !(session.user as any).role ||
      !["super_admin", "admin", "editor"].includes((session.user as any).role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. กำหนดชื่อไฟล์ใหม่ เปลี่ยนนามสกุลเป็น .webp เพื่อประสิทธิภาพสูงสุด
    const filename = `${uuidv4()}.webp`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    // ตรวจสอบว่ามีโฟลเดอร์หรือยัง ถ้าไม่มีให้สร้าง
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const path = join(uploadDir, filename);

    // 2. กระบวนการลดขนาดรูปภาพด้วย Sharp 🚀
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 820, {
        fit: "cover", // ตัดส่วนที่เกินออกเพื่อให้ได้สัดส่วนพอดี
        position: "center", // เน้นจุดกลางภาพ
      })
      .webp({ quality: 80 }) // แปลงเป็น WebP และตั้งคุณภาพที่ 80% (ไฟล์จะเล็กมากแต่ยังชัด)
      .toBuffer();

    // 3. เขียนไฟล์ที่ลดขนาดแล้วลง Disk
    await writeFile(path, optimizedBuffer);

    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      message: "อัปโหลดและลดขนาดภาพเรียบร้อยแล้ว",
    });
  } catch (error: any) {
    console.error("Upload & Optimization Error:", error);
    return NextResponse.json(
      { error: "การประมวลผลรูปภาพล้มเหลว" },
      { status: 500 },
    );
  }
}
