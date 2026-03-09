import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ลบข้อมูลทั้งหมดใน collection logs
    await db.collection("logs").deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Logs cleared successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
