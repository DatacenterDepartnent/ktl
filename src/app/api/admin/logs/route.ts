import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const logs = await db
      .collection("logs")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { action, details, link, userName: manualName } = body;

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const newLog = {
      userName: session?.user?.name || manualName || "System_Kernel",
      userEmail: session?.user?.email || null,
      action: action || "UNKNOWN_ACTION",
      details: details || "No details provided",
      link: link || null,
      timestamp: new Date(),
      ip,
      role: (session?.user as any)?.role || "guest",
    };

    await db.collection("logs").insertOne(newLog);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("LOG_POST_ERROR:", error);
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    await db.collection("logs").insertOne({
      userName: session.user?.name,
      action: "WIPE_ALL_LOGS",
      details: "ล้างประวัติกิจกรรมทั้งหมดโดย Super Admin",
      timestamp: new Date(),
      ip: "INTERNAL",
    });

    await db
      .collection("logs")
      .deleteMany({ action: { $ne: "WIPE_ALL_LOGS" } });

    return NextResponse.json({ success: true, message: "Logs cleared" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear logs" },
      { status: 500 },
    );
  }
}
