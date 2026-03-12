// src\app\api\admin\upload\route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

// หมายเหตุ: ไม่ต้องใส่ export const config ในไฟล์นี้สำหรับ App Router

export async function POST(req: Request) {
  try {
    // 1. ตรวจสอบสิทธิ์การเข้าถึง
    const session = await auth();

    // ตรวจสอบว่า Login หรือไม่ และมี Role ที่อนุญาตหรือไม่
    if (
      !session ||
      !(session.user as any).role ||
      !["super_admin", "admin", "editor"].includes((session.user as any).role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. รับข้อมูลไฟล์จาก FormData
    // (จะทำงานได้เกิน 1MB ต้องตั้งค่า serverActions.bodySizeLimit ใน next.config.js แล้วเท่านั้น)
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. แปลงไฟล์เป็น Buffer เพื่อส่งให้ Sharp ประมวลผล
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. เตรียมเส้นทางจัดเก็บไฟล์
    const filename = `${uuidv4()}.webp`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // โฟลเดอร์อาจจะมีอยู่แล้ว ไม่ต้องทำอะไร
    }

    const path = join(uploadDir, filename);

    // 5. ประมวลผลรูปภาพด้วย Sharp 🚀
    // - ปรับขนาดเป็น 1920x820 (สัดส่วนแบนเนอร์)
    // - ตัดขอบแบบ Cover และเน้นตรงกลาง
    // - แปลงเป็น .webp คุณภาพ 80% เพื่อลดขนาดไฟล์
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, null, {
        // null คือปล่อยให้ความสูงปรับตามสัดส่วนอัตโนมัติ
        withoutEnlargement: true, // ถ้ารูปเล็กกว่า 1920px จะไม่ขยายให้แตก
      })
      .webp({ quality: 80 })
      .toBuffer();

    // 6. บันทึกไฟล์ที่ประมวลผลแล้วลงในระบบ
    await writeFile(path, optimizedBuffer);

    // 7. ส่ง URL กลับไปยัง Client
    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/${filename}`,
      message: "อัปโหลดและลดขนาดภาพเรียบร้อยแล้ว",
    });
  } catch (error: any) {
    console.error("Upload Error:", error);

    // จัดการกรณี Error ทั่วไป
    return NextResponse.json(
      { error: "การประมวลผลรูปภาพล้มเหลว หรือไฟล์มีขนาดใหญ่เกินไป" },
      { status: 500 },
    );
  }
}
