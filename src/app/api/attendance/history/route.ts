import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit") || "30";
    const limit = parseInt(limitParam);

    const attendances = await Attendance.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: attendances }, { status: 200 });
  } catch (error: any) {
    console.error("History Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
