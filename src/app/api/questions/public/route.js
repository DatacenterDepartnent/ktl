import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const questions = await db
      .collection("questions")
      .find({ status: { $ne: "hidden" } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(questions);
  } catch (error) {
    console.error("❌ [API QUESTIONS PUBLIC GET ERROR]:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { guestName, subject, content } = await req.json();
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const displayName = guestName || "บุคคลทั่วไป";

    const newQuestion = {
      guestName: displayName,
      subject,
      content,
      status: "pending",
      answer: null,
      repliedBy: null,
      createdAt: new Date(),
    };

    const result = await db.collection("questions").insertOne(newQuestion);

    // ✅ บันทึก Log: ใส่ userName ให้ตรงกับชื่อคนถาม จะได้ไม่ขึ้น SYSTEM
    await db.collection("logs").insertOne({
      userName: displayName,
      action: "GUEST_QUESTION",
      details: `คำถามใหม่: ${subject}`,
      link: `/dashboard/questions#${result.insertedId}`,
      module: "Q&A",
      targetId: result.insertedId,
      timestamp: new Date(),
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("❌ [API QUESTIONS PUBLIC POST ERROR]:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: "Post failed" }, { status: 500 });
  }
}
