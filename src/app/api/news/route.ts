import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    // ✅ 1. รับค่า announcementImages เพิ่มเข้ามา
    const { title, categories, content, images, announcementImages, links } =
      await request.json();

    // Validation
    if (
      !title ||
      !categories ||
      !Array.isArray(categories) ||
      categories.length === 0 ||
      !content
    ) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน (หัวข้อ, หมวดหมู่, เนื้อหา)" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const newNews = {
      title,
      categories,
      content,
      images: images || [],
      // ✅ 2. บันทึกลง DB (ถ้าไม่มีให้เป็น empty array)
      announcementImages: announcementImages || [],
      links: links || [],
      createdAt: new Date().toISOString(),
    };

    await db.collection("news").insertOne(newNews);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
