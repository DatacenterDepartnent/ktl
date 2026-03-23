import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(req) {
  try {
    const { customerName, subject, details } = await req.json();
    const forwarded = req.headers.get("x-forwarded-for");
    const posterIp = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const newQuestion = await db.collection("questions").insertOne({
      customerName,
      subject,
      details,
      status: "pending",
      createdAt: new Date(),
      posterIp,
    });

    await db.collection("logs").insertOne({
      userName: customerName || "GUEST",
      action: "GUEST_QUESTION",
      details: `คำถามใหม่: ${subject}`,
      module: "Q&A",
      timestamp: new Date(),
      ip: posterIp,
      targetId: newQuestion.insertedId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
