import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export const dynamic = "force-dynamic"; // ป้องกันการทำ Static Cache

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // ✅ ใช้ Aggregation Pipeline เพื่อความเร็วระดับมิลลิวินาที
    const stats = await db
      .collection("logs")
      .aggregate([
        {
          $match: { timestamp: { $gte: thirtyDaysAgo } },
        },
        {
          $group: {
            _id: null,
            totalActions: { $sum: 1 },
            approvals: {
              $sum: { $cond: [{ $eq: ["$action", "APPROVE"] }, 1, 0] }, // แก้ชื่อ Action ให้ตรงกับหน้า PATCH
            },
            roleChanges: {
              $sum: { $cond: [{ $eq: ["$action", "CHANGE_ROLE"] }, 1, 0] },
            },
            updates: {
              $sum: { $cond: [{ $eq: ["$action", "UPDATE_PROFILE"] }, 1, 0] },
            },
          },
        },
      ])
      .toArray();

    const result = stats[0] || {
      totalActions: 0,
      approvals: 0,
      roleChanges: 0,
      updates: 0,
    };

    return NextResponse.json({
      totalActions: result.totalActions,
      approvals: result.approvals,
      roleChanges: result.roleChanges,
      updates: result.updates,
    });
  } catch (error) {
    console.error("Summary Report Error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
