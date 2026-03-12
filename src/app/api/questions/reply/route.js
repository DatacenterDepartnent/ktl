import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function PATCH(req) {
  try {
    const session = await auth();

    // 1. เช็คสิทธิ์: ถ้าไม่มี Session หรือไม่ใช่แอดมิน ให้ไล่ไปสัส
    if (!session || !session.user || !session.user.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, answerText, isEditing } = await req.json();

    // เช็คข้อมูลเบื้องต้น
    if (!questionId || !answerText) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 2. ค้นหาคำถามเดิมก่อนอัปเดต (เอามาใช้เขียน Log)
    const originalQuestion = await db.collection("questions").findOne({
      _id: new ObjectId(questionId),
    });

    if (!originalQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    // 3. ทำการอัปเดตคำตอบลงใน Database
    const updateResult = await db.collection("questions").updateOne(
      { _id: new ObjectId(questionId) },
      {
        $set: {
          answer: answerText,
          repliedBy: session.user.name,
          repliedAt: new Date(),
          status: "answered",
        },
      },
    );

    if (updateResult.matchedCount === 1) {
      const customerName = originalQuestion.guestName || "บุคคลทั่วไป";

      // 4. บันทึก Log: แยก Action ให้ชัดเจนว่าเป็นการ "ตอบใหม่" หรือ "แก้ไข"
      // แอดมินคนอื่นจะได้รู้ว่ามึงแอบมาแก้คำพูดสัส!
      await db.collection("logs").insertOne({
        userName: session.user.name,
        action: isEditing ? "EDIT_REPLY" : "REPLY_QUESTION", // เช็ค Flag จาก Frontend
        details: `${isEditing ? "แก้ไขคำตอบ" : "ตอบคำถาม"} ของ: ${customerName} (หัวข้อ: ${originalQuestion.subject})`,
        link: `/dashboard/questions#${questionId}`, // ลิงก์ตรงไปหาคำถาม
        module: "Q&A",
        timestamp: new Date(),
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
        targetId: new ObjectId(questionId),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  } catch (error) {
    console.error("REPLY_API_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ---------------------------------------------------------
// 🗑️ แถม: API สำหรับลบคำถาม (มึงถามหาเมื่อกี้)
// ---------------------------------------------------------
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // เก็บข้อมูลก่อนลบไว้ลง Log
    const target = await db
      .collection("questions")
      .findOne({ _id: new ObjectId(id) });

    const result = await db.collection("questions").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      await db.collection("logs").insertOne({
        userName: session.user.name,
        action: "DELETE_QUESTION",
        details: `ลบคำถามของ: ${target?.guestName || "Unknown"} (หัวข้อ: ${target?.subject})`,
        module: "Q&A",
        timestamp: new Date(),
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
