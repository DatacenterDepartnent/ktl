import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // อัปเดตฟิลด์ lastActive ใน User หรือ Session Collection
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(payload.userId as string) },
        { $set: { lastActive: new Date() } },
      );

    return NextResponse.json({ status: "alive" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
