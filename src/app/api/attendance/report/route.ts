import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import '@/models/User'; // Ensure User model is loaded

export async function GET(req: Request) {
  try {
    await connectDB();
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

    const records = await Attendance.find({ date: dateQuery })
      .populate('userId', 'name email username role')
      .sort({ date: -1, 'checkIn.time': -1 })
      .lean();

    const formattedData = records.map((r: any) => ({
      id: r._id.toString(),
      date: typeof r.date === 'string' ? r.date : r.date.toISOString(),
      user: {
        name: r.userId?.name || r.userId?.username || 'Unknown User',
        email: r.userId?.email || ''
      },
      checkInTime: r.checkIn?.time || null,
      checkOutTime: r.checkOut?.time || null,
      status: r.status,
      otHours: r.checkOut?.otHours || 0,
      photoUrl: r.checkIn?.photoUrl || null
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error: any) {
    console.error("Report API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
