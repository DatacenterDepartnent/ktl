import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// Helper สำหรับบันทึก Log
async function createLog(
  db: any,
  req: NextRequest,
  action: string,
  details: string,
) {
  const session = await auth();
  await db.collection("logs").insertOne({
    userName: session?.user?.name || "Admin",
    action,
    details,
    module: "SOCIAL_FEED",
    timestamp: new Date(),
    ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
  });
}

// DELETE: ลบ Feed
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const feed = await db
      .collection("social_feeds")
      .findOne({ _id: new ObjectId(id) });
    if (!feed)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    await db.collection("social_feeds").deleteOne({ _id: new ObjectId(id) });
    await createLog(
      db,
      req,
      "DELETE_FEED",
      `ลบ ${feed.platform} feed: ${feed.title}`,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PATCH: แก้ไข Feed
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    await db
      .collection("social_feeds")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...body, updatedAt: new Date() } },
      );

    await createLog(
      db,
      req,
      "UPDATE_FEED",
      `แก้ไข ${body.platform} feed: ${body.title}`,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
