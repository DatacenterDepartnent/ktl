import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const report = await db.collection("activity_logs").aggregate([
      {
        $group: {
          _id: {
            month: { $month: { $toDate: "$timestamp" } },
            year: { $year: { $toDate: "$timestamp" } },
            action: "$action",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]).toArray();

    return NextResponse.json({ success: true, data: report });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
