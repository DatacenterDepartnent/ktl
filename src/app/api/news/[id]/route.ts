import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// --- GET: ดึงข้อมูลรายตัว (ทุกคนดูได้) ---
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const news = await db.collection("news").findOne({ _id: new ObjectId(id) });

    if (!news) {
      return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

// --- PUT: แก้ไขข้อมูล (เช็คสิทธิ์เจ้าของ) ---
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const existingNews = await db
      .collection("news")
      .findOne({ _id: new ObjectId(id) });

    if (!existingNews) {
      return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
    }

    // --- ตรวจสอบสิทธิ์แก้ไข ---
    const userEmail = session.user.email;
    const userNameInSession = session.user.name;
    const userRole = (session.user as any).role;

    let authorNameFromDB = "";
    if (
      typeof existingNews.author === "object" &&
      existingNews.author !== null
    ) {
      authorNameFromDB =
        existingNews.author.name?.name || existingNews.author.name || "";
    } else {
      authorNameFromDB = existingNews.author || "";
    }

    // สิทธิ์การแก้ไข: ชื่อตรงกัน OR อีเมลตรงกัน OR เป็น Admin
    const isOwner =
      (Boolean(authorNameFromDB) && userNameInSession === authorNameFromDB) ||
      (Boolean(existingNews.authorEmail) &&
        userEmail === existingNews.authorEmail);

    const isAdmin = userRole === "super_admin" || userRole === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์แก้ไขโพสต์ของผู้อื่น" },
        { status: 403 },
      );
    }

    const {
      title,
      categories,
      content,
      images,
      announcementImages,
      links,
      videoEmbeds,
    } = body;

    await db.collection("news").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          categories,
          category: categories?.[0] || "ทั่วไป",
          content,
          images: images || [],
          announcementImages: announcementImages || [],
          links: links || [],
          videoEmbeds: videoEmbeds || [],
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "แก้ไขล้มเหลว" }, { status: 500 });
  }
}

// --- DELETE: ลบข่าว (เช็คสิทธิ์เจ้าของ) ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    // 1. เช็คการล็อกอิน
    if (!session || !session.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 2. ค้นหาข่าวเพื่อเช็คเจ้าของ
    const existingNews = await db
      .collection("news")
      .findOne({ _id: new ObjectId(id) });

    if (!existingNews) {
      return NextResponse.json({ error: "ไม่พบข้อมูลข่าว" }, { status: 404 });
    }

    // --- 3. ส่วนตรวจสอบสิทธิ์ (Logic ปรับปรุงใหม่) ---
    const userEmail = session.user.email;
    const userNameInSession = session.user.name; // ค่าจาก Session (ภาษาไทย)
    const userRole = (session.user as any).role;

    let authorNameFromDB = "";
    // เจาะโครงสร้าง Object ตาม Log: { author: { name: 'สิริปัญญ์...' } }
    if (
      typeof existingNews.author === "object" &&
      existingNews.author !== null
    ) {
      authorNameFromDB =
        existingNews.author.name?.name || existingNews.author.name || "";
    } else {
      authorNameFromDB = existingNews.author || "";
    }

    console.log("--- Deleting Process ---");
    console.log("Logged In Name:", userNameInSession);
    console.log("DB Author Name:", authorNameFromDB);

    // ✅ เงื่อนไข: ชื่อตรงกันเป๊ะ OR Email ตรงกัน OR เป็น Admin
    const isOwner =
      (Boolean(authorNameFromDB) && userNameInSession === authorNameFromDB) ||
      (Boolean(existingNews.authorEmail) &&
        userEmail === existingNews.authorEmail);

    const isAdmin = userRole === "super_admin" || userRole === "admin";

    if (!isOwner && !isAdmin) {
      console.log(
        "❌ Access Denied: mismatch between",
        userNameInSession,
        "and",
        authorNameFromDB,
      );
      return NextResponse.json(
        { error: `คุณไม่มีสิทธิ์ลบโพสต์ของ ${authorNameFromDB || "ผู้อื่น"}` },
        { status: 403 },
      );
    }

    // --- 4. ดำเนินการลบ ---
    console.log("✅ Access Granted: Deleting ID", id);
    const result = await db
      .collection("news")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "ลบสำเร็จ" });
    }

    return NextResponse.json({ error: "ลบไม่สำเร็จ" }, { status: 400 });
  } catch (error) {
    console.error("DELETE API Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 },
    );
  }
}
