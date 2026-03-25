import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Aggregate target date's attendance stats
    const stats = await Attendance.aggregate([
      { $match: { date: targetDate } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format for Recharts
    const formattedData = [
      { name: 'มาทำงานตรงเวลา', value: 0, color: '#22c55e' }, // Present
      { name: 'มาสาย', value: 0, color: '#eab308' },       // Late
      { name: 'ลา / ขาด', value: 0, color: '#ef4444' }     // Leave / Absent
    ];

    stats.forEach(stat => {
      if (stat._id === 'Present') formattedData[0].value = stat.count;
      else if (stat._id === 'Late') formattedData[1].value = stat.count;
      else if (stat._id === 'Leave' || stat._id === 'Absent') formattedData[2].value += stat.count;
    });

    // Fetch actual records for the Map Markers
    const rawRecords = await Attendance.find({ date: targetDate }).populate('userId', 'name image').lean() as any[];
    const markers = rawRecords.map((r) => ({
      id: r._id.toString(),
      name: r.userId?.name || 'พนักงาน',
      lat: r.checkIn?.location?.lat,
      lng: r.checkIn?.location?.lng,
      status: r.status,
      time: r.checkIn?.time,
      photoUrl: r.checkIn?.photoUrl
    })).filter(r => r.lat && r.lng);

    return NextResponse.json({ success: true, data: formattedData, markers });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
