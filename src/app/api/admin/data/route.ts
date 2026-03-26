import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "attendance";
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    if (type === "attendance") {
      const attendances = await db
        .collection("attendances")
        .aggregate([
          { $sort: { date: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $addFields: {
              // Convert userId to ObjectId if it's a string, to ensure lookup works
              uId: { $toObjectId: "$userId" }
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "uId",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              date: 1,
              status: 1,
              checkIn: { time: 1 },
              checkOut: { time: 1 },
              "user.name": 1,
              "user.username": 1,
              "user.email": 1
            },
          },
        ])
        .toArray();
      return NextResponse.json({ success: true, data: attendances });
    } else if (type === "leave") {
      const leaves = await db
        .collection("leave_requests")
        .aggregate([
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $addFields: {
              uId: { $toObjectId: "$userId" }
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "uId",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              startDate: 1,
              endDate: 1,
              status: 1,
              reason: 1,
              leaveType: 1,
              "user.name": 1,
              "user.username": 1,
              "user.email": 1
            },
          },
        ])
        .toArray();
      return NextResponse.json({ success: true, data: leaves });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "super_admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type)
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );

    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const collection = type === "attendance" ? "attendances" : "leave_requests";

    const result = await db
      .collection(collection)
      .deleteOne({ _id: new ObjectId(id) });

    // Log the deletion action
    await db.collection("activity_logs").insertOne({
      userName:
        (session?.user as any)?.name ||
        (session?.user as any)?.username ||
        "Super_Admin",
      action: `DELETE_${type.toUpperCase()}`,
      details: `Deleted ${type} record ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      timestamp: new Date().toISOString(),
      duration: 0,
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "super_admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const { id, type, updates } = body;

    if (!id || !type || !updates)
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );

    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const collection = type === "attendance" ? "attendances" : "leave_requests";

    delete updates._id;

    // Fix nested date fields for attendance
    if (updates.date) updates.date = new Date(updates.date);
    if (updates.checkIn?.time)
      updates.checkIn.time = new Date(updates.checkIn.time);
    if (updates.checkOut?.time)
      updates.checkOut.time = new Date(updates.checkOut.time);

    // Fix date fields for leave requests
    if (updates.startDate) updates.startDate = new Date(updates.startDate);
    if (updates.endDate) updates.endDate = new Date(updates.endDate);

    const result = await db
      .collection(collection)
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    // Log the update action
    await db.collection("activity_logs").insertOne({
      userName:
        (session?.user as any)?.name ||
        (session?.user as any)?.username ||
        "Super_Admin",
      action: `UPDATE_${type.toUpperCase()}`,
      details: `Updated ${type} record ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      timestamp: new Date().toISOString(),
      duration: 0,
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
