import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "attendance";
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");
    const search = searchParams.get("search") || "";
    console.log(`[API] GET Data Start: type=${type}, search=${search}`);
    const start = Date.now();

    const session = await auth();
    const midAuth = Date.now();
    console.log(`[API] Auth took ${midAuth - start}ms`);

    const role = (session?.user as any)?.role;
    if (role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const midConn = Date.now();
    console.log(`[API] DB Connect took ${midConn - midAuth}ms`);

    let matchQuery: any = {};
    if (search) {
      if (ObjectId.isValid(search)) {
        matchQuery = { 
          $or: [
            { _id: new ObjectId(search) }, 
            { userId: new ObjectId(search) }, 
            { userId: search }
          ] 
        };
      } else {
        const matchingUsers = await db.collection("users").find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        }).project({ _id: 1 }).limit(10).toArray(); // Limit user search for speed
        
        const userIds = matchingUsers.map(u => u._id);
        const userIdsStrings = userIds.map(id => id.toString());
        
        matchQuery = {
          $or: [
            { userId: { $in: userIds } },
            { userId: { $in: userIdsStrings } },
            { _id: search }
          ]
        };
      }
    }
    console.log(`[API] matchQuery: ${JSON.stringify(matchQuery)}`);

    if (type === "attendance") {
      const attendances = await db
        .collection("attendances")
        .aggregate([
          { $match: matchQuery },
          { $sort: { date: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $addFields: {
              uId: { 
                $cond: {
                  if: { $eq: [{ $type: "$userId" }, "objectId"] },
                  then: "$userId",
                  else: {
                    $cond: {
                      if: { $and: [
                        { $ne: [{ $type: "$userId" }, "missing"] },
                        { $ne: [{ $type: "$userId" }, "null"] },
                        { $eq: [{ $strLenCP: { $toString: "$userId" } }, 24] }
                      ]},
                      then: { $toObjectId: "$userId" },
                      else: null
                    }
                  }
                }
              }
            }
          },
          {
            $lookup: {
              from: "users",
              let: { u_id: "$uId" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$u_id"] } } },
                { $project: { name: 1, username: 1, email: 1, _id: 0 } }
              ],
              as: "user",
            },
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1, date: 1, status: 1,
              checkIn: { time: 1 }, checkOut: { time: 1 },
              user: 1
            },
          },
        ], { maxTimeMS: 5000 }) 
        .toArray();
      
      const end = Date.now();
      console.log(`[API] Attendance Query took ${end - midConn}ms. Found: ${attendances.length}`);
      return NextResponse.json({ success: true, data: attendances });
    } 

    if (type === "leave") {
      console.log(`[API] Leave Query Start: match=${JSON.stringify(matchQuery)}`);
      const leaves = await db
        .collection("leave_requests")
        .aggregate([
          { $match: matchQuery },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $addFields: {
              uId: { 
                $cond: {
                  if: { $eq: [{ $type: "$userId" }, "objectId"] },
                  then: "$userId",
                  else: {
                    $cond: {
                      if: { $and: [
                        { $ne: [{ $type: "$userId" }, "missing"] },
                        { $ne: [{ $type: "$userId" }, "null"] },
                        { $eq: [{ $strLenCP: { $toString: "$userId" } }, 24] }
                      ]},
                      then: { $toObjectId: "$userId" },
                      else: null
                    }
                  }
                }
              }
            }
          },
          {
            $lookup: {
              from: "users",
              let: { u_id: "$uId" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$u_id"] } } },
                { $project: { name: 1, username: 1, email: 1, _id: 0 } }
              ],
              as: "user",
            },
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1, startDate: 1, endDate: 1, status: 1,
              reason: 1, leaveType: 1,
              user: 1
            },
          },
        ], { maxTimeMS: 5000 }) 
        .toArray();
      
      const end = Date.now();
      console.log(`[API] Leave Query took ${end - midConn}ms. Found: ${leaves.length}`);
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

    // Handle both ObjectId and String ID scenarios
    let query: any = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
    }

    const result = await db
      .collection(collection)
      .deleteOne(query);

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

    // Handle both ObjectId and String ID scenarios
    let query: any = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
    }

    const result = await db
      .collection(collection)
      .updateOne(query, { $set: updates });

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
