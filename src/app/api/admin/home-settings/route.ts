import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * ฟังก์ชันช่วยบันทึก Log (Internal helper)
 */
async function createLog(
  db: any,
  action: string,
  details: string,
  req: Request,
  session: any, // ส่ง session เข้ามาเลยเพื่อลดการเรียกซ้ำ
) {
  try {
    await db.collection("logs").insertOne({
      userName: session?.user?.name || "Unknown Admin",
      userEmail: session?.user?.email || "N/A", // เก็บ Email ไว้ด้วยเผื่อชื่อซ้ำ
      action,
      details,
      module: "HOME_SETTINGS",
      timestamp: new Date(),
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "N/A",
    });
  } catch (error) {
    console.error("Critical: Failed to create audit log:", error);
  }
}

// GET: ดึงข้อมูลทั้งหมด
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const components = await db.collection("home_settings").find().toArray();
    const siteSettings = await db.collection("site_settings").find().toArray();
    return NextResponse.json({ components, siteSettings });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// PATCH: อัปเดตข้อมูล พร้อมบันทึก Log
export async function PATCH(req: Request) {
  try {
    // 1. ตรวจสอบสิทธิ์ (Security First)
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, componentId, isVisible, key, value, label } =
      await req.json();
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 2. แยกจัดการตามประเภท
    if (type === "COMPONENT_VISIBILITY") {
      await db
        .collection("home_settings")
        .updateOne(
          { componentId },
          { $set: { isVisible, updatedAt: new Date() } },
          { upsert: true },
        );

      const statusText = isVisible ? "เปิดการแสดงผล" : "ปิดการแสดงผล";
      await createLog(
        db,
        "UPDATE_VISIBILITY",
        `${statusText}ส่วนประกอบ: ${label || componentId}`,
        req,
        session,
      );
    } else if (type === "SITE_SETTING") {
      // ดึงค่าเก่ามาเปรียบเทียบใน Log (Optional แต่อยากแนะนำ)
      const oldData = await db.collection("site_settings").findOne({ key });

      await db
        .collection("site_settings")
        .updateOne(
          { key },
          { $set: { value, updatedAt: new Date() } },
          { upsert: true },
        );

      await createLog(
        db,
        "UPDATE_SITE_SETTING",
        `แก้ไข ${label || key} จาก "${oldData?.value || ""}" เป็น "${value}"`,
        req,
        session,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
