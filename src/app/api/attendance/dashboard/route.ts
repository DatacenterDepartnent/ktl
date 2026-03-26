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
    const dateParam = searchParams.get('date');

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // 1. Aggregate Stats using Native Driver
    const stats = await db.collection("attendances").aggregate([
      { $match: { date: targetDate } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const formattedData = [
      { name: 'มาทำงานตรงเวลา', value: 0, color: '#22c55e' },
      { name: 'มาสาย', value: 0, color: '#eab308' },
      { name: 'ลา / ขาด', value: 0, color: '#ef4444' }
    ];

    stats.forEach(stat => {
      if (stat._id === 'Present') formattedData[0].value = stat.count;
      else if (stat._id === 'Late') formattedData[1].value = stat.count;
      else if (stat._id === 'Leave' || stat._id === 'Absent') formattedData[2].value += stat.count;
    });

    // 2. Fetch Markers with efficient $lookup instead of populate
    const markers = await db.collection("attendances").aggregate([
      { $match: { date: targetDate } },
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
          name: { $ifNull: ["$userDetails.name", "พนักงาน"] },
          lat: "$checkIn.location.lat",
          lng: "$checkIn.location.lng",
          status: "$status",
          time: "$checkIn.time",
          photoUrl: "$checkIn.photoUrl"
        }
      }
    ]).toArray();

    // Filter markers with valid coordinates
    const validMarkers = markers.filter(m => m.lat && m.lng);

    const end = Date.now();
    console.log(`[API] Dashboard Stats took ${end - start}ms (DB: ${end - midConn}ms)`);

    return NextResponse.json({ success: true, data: formattedData, markers: validMarkers });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
