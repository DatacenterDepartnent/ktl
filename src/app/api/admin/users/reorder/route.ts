import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { users } = await req.json();
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // อัปเดต orderIndex ของทุก user ตามลำดับใหม่
    const operations = users.map((user: any, index: number) => ({
      updateOne: {
        filter: { _id: new ObjectId(user._id) },
        update: { $set: { orderIndex: index } },
      },
    }));

    await db.collection("users").bulkWrite(operations);

    return NextResponse.json({ message: "อัปเดตลำดับสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
