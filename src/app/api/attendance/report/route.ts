import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  const start = Date.now();
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const midConn = Date.now();

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let dateQuery: any = {};
    if (startDateParam && endDateParam) {
      dateQuery = {
        $gte: new Date(startDateParam + "T00:00:00.000Z"),
        $lte: new Date(endDateParam + "T23:59:59.999Z")
      };
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateQuery = today;
    }

    const records = await db.collection("attendances").aggregate([
      { $match: { date: dateQuery } },
      { $sort: { date: -1, 'checkIn.time': -1 } },
      {
        $addFields: {
          uId: { 
            $cond: {
              if: { $ne: [{ $type: "$userId" }, "missing"] },
              then: { $toObjectId: "$userId" },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "uId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: { $toString: "$_id" },
          date: 1,
          user: {
            name: { $ifNull: ["$userDetails.name", { $ifNull: ["$userDetails.username", "Unknown User"] }] },
            email: { $ifNull: ["$userDetails.email", ""] }
          },
          checkInTime: "$checkIn.time",
          checkOutTime: "$checkOut.time",
          status: "$status",
          otHours: { $ifNull: ["$checkOut.otHours", 0] },
          photoUrl: "$checkIn.photoUrl"
        }
      }
    ]).toArray();

    const formattedData = records.map((r: any) => ({
      ...r,
      date: typeof r.date === 'string' ? r.date : r.date.toISOString()
    }));

    const end = Date.now();
    console.log(`[API] Attendance Report took ${end - start}ms (DB: ${end - midConn}ms). Records: ${formattedData.length}`);

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error: any) {
    console.error("Report API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
