import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const userId = (session?.user as any)?.id;
    const userRole = (session?.user as any)?.role;

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date'); // YYYY-MM-DD
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const targetUserId = searchParams.get('userId');

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // Case 1: Fetch all reports for a date range (Admin only)
    if (startDateParam && endDateParam) {
      const allowedRoles = ['super_admin', 'admin', 'hr', 'director', 'deputy_director', 'editor'];
      if (!allowedRoles.includes(userRole)) {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const records = await db.collection("work_reports").aggregate([
        { 
          $match: { 
            date: {
              $gte: new Date(startDateParam + "T00:00:00.000Z"),
              $lte: new Date(endDateParam + "T23:59:59.999Z")
            }
          }
        },
        { $sort: { date: -1, createdAt: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
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
              name: { $ifNull: ["$userDetails.name", "Unknown User"] },
              email: { $ifNull: ["$userDetails.email", ""] },
              department: { $ifNull: ["$userDetails.department", "N/A"] }
            },
            activities: 1,
            summary: 1,
            problems: 1,
            plansNextDay: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ]).toArray();

      return NextResponse.json({ success: true, data: records });
    }

    // Case 2: Fetch single report for a specific date and user
    let queryDate: Date;
    if (dateParam) {
        queryDate = new Date(dateParam);
    } else {
        queryDate = new Date();
    }
    queryDate.setUTCHours(0, 0, 0, 0);

    const queryUserId = targetUserId || userId;
    
    // Security: Only allow fetching own report unless admin
    const allowedRoles = ['super_admin', 'admin', 'hr', 'director', 'deputy_director', 'editor'];
    if (queryUserId !== userId && !allowedRoles.includes(userRole)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const report = await db.collection("work_reports").findOne({
      userId: new ObjectId(queryUserId),
      date: queryDate
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error("Work Report GET Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const { date, activities, summary, problems, plansNextDay } = data;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const reportDate = date ? new Date(date) : new Date();
    reportDate.setUTCHours(0, 0, 0, 0);

    const updateDoc = {
      $set: {
        activities,
        summary,
        problems,
        plansNextDay,
        updatedAt: new Date()
      },
      $setOnInsert: {
        userId: new ObjectId(userId),
        date: reportDate,
        createdAt: new Date()
      }
    };

    const result = await db.collection("work_reports").findOneAndUpdate(
      { userId: new ObjectId(userId), date: reportDate },
      updateDoc,
      { upsert: true, returnDocument: 'after' }
    );
    
    // Safety check for result (TypeScript)
    const savedReport = result?.value || result;

    return NextResponse.json({ success: true, data: savedReport });
  } catch (error: any) {
    console.error("Work Report POST Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    if (userRole !== 'super_admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { id, activities, summary, problems, plansNextDay } = data;

    if (!id) return NextResponse.json({ error: "Missing report ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const result = await db.collection("work_reports").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          activities,
          summary,
          problems,
          plansNextDay,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Report updated successfully" });
  } catch (error: any) {
    console.error("Work Report PATCH Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    if (userRole !== 'super_admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Missing report ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const result = await db.collection("work_reports").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Report deleted successfully" });
  } catch (error: any) {
    console.error("Work Report DELETE Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
