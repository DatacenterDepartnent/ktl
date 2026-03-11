import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * ฟังก์ชันช่วยบันทึก Log ภายในไฟล์
 */
async function createLog(
  db: any,
  req: NextRequest,
  action: string,
  details: string,
) {
  try {
    const session = await auth();
    await db.collection("logs").insertOne({
      userName: session?.user?.name || "Admin",
      action,
      details,
      module: "SOCIAL_FEED",
      timestamp: new Date(),
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });
  } catch (error) {
    console.error("Failed to create log:", error);
  }
}

// GET: ดึงข้อมูล Feed ทั้งหมดไปแสดงผล
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const feeds = await db
      .collection("social_feeds")
      .find()
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(feeds);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 },
    );
  }
}

// POST: เพิ่ม Feed ใหม่ (Facebook/YouTube) พร้อมบันทึก Log
export async function POST(req: NextRequest) {
  try {
    // 1. ตรวจสอบสิทธิ์
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { platform, title, url, embedId, order } = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!platform || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 2. บันทึกลงฐานข้อมูล
    const result = await db.collection("social_feeds").insertOne({
      platform, // 'facebook' หรือ 'youtube'
      title,
      url,
      embedId,
      order: parseInt(order) || 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. บันทึก Log
    await createLog(
      db,
      req,
      "ADD_FEED",
      `เพิ่ม ${platform} feed: ${title || url}`,
    );

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}
