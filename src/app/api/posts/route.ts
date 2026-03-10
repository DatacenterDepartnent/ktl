import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// 1. ดึงโพสต์ทั้งหมด
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const posts = await db
      .collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// 2. สร้างโพสต์ใหม่ (และบันทึก Log ผู้ใช้)
export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    const userName = session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, image } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // บันทึกข้อมูลโพสต์ลง Collection posts
    const newPost = {
      userId: new ObjectId(userId),
      author: userName,
      title,
      content,
      image,
      createdAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(newPost);

    // ✅ ส่วนสำคัญ: บันทึก Log กิจกรรมเพื่อให้ไปโชว์ในหน้า Admin
    await db.collection("logs").insertOne({
      userId: new ObjectId(userId), // ID ของผู้ใช้งานที่โพสต์
      userName: userName || "User", // ชื่อผู้ใช้งาน
      action: "CREATE_POST", // ประเภทกิจกรรม
      details: `สร้างโพสต์ใหม่หัวข้อ: ${title}`, // รายละเอียด/route.ts]
      targetId: result.insertedId, // ID ของโพสต์ที่ถูกสร้าง
      timestamp: new Date(),
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, postId: result.insertedId });
  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
