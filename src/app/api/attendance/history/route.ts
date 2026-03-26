import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit") || "30";
    const limit = parseInt(limitParam);

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    let queryConditions = [];
    queryConditions.push({ userId: userId });
    
    if (ObjectId.isValid(userId)) {
      queryConditions.push({ userId: new ObjectId(userId) });
    } else {
      // If it somehow isn't a valid ObjectId but we still want to query it as string
      console.warn("User ID in session is not a valid ObjectId:", userId);
    }

    let attendances = await db.collection("attendances").find({ 
      $or: queryConditions
    })
      .sort({ date: -1 })
      .limit(limit)
      .toArray();

    // ✅ สร้าง Mock Data ทันทีหากผู้ใช้งานยังไม่มีประวัติการลงเวลา
    if (attendances.length === 0) {
      const today = new Date();
      
      const dummy1Date = new Date(today);
      dummy1Date.setDate(dummy1Date.getDate() - 1);
      
      const dummy2Date = new Date(today);
      dummy2Date.setDate(dummy2Date.getDate() - 2);

      const dummyAttendances = [
        {
          _id: new ObjectId(),
          userId: new ObjectId(userId),
          date: dummy1Date,
          checkIn: { time: new Date(dummy1Date.setHours(8, 15, 0)), statusTag: "Remote" },
          checkOut: { time: new Date(dummy1Date.setHours(17, 30, 0)) },
          status: "Present",
          createdAt: dummy1Date
        },
        {
          _id: new ObjectId(),
          userId: new ObjectId(userId),
          date: dummy2Date,
          checkIn: { time: new Date(dummy2Date.setHours(8, 25, 0)), statusTag: "In-Site" },
          checkOut: { time: new Date(dummy2Date.setHours(18, 0, 0)) },
          status: "Present",
          createdAt: dummy2Date
        }
      ];

      // Insert mock data into database so it persists
      await db.collection("attendances").insertMany(dummyAttendances);
      attendances = dummyAttendances;
      
      console.log(`[API /history] Automatically seeded 2 dummy records for User ${userId}.`);
    } else {
      console.log(`[API /history] User ${userId} requested history. Found ${attendances.length} records.`);
    }

    return NextResponse.json({ success: true, data: attendances }, { status: 200 });
  } catch (error: any) {
    console.error("History Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
