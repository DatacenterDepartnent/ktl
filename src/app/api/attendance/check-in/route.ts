import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { calculateDistance } from '@/lib/geoDistance';

// สมมติพิกัดวิทยาลัย (College Location)
const COLLEGE_LOCATION = { lat: 13.7563, lng: 100.5018 };
const ALLOWED_RADIUS = 500; // 500 meters

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const { userId, lat, lng, photoUrl, deviceId, address } = data;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    const serverTime = new Date();
    
    // Geofencing
    let statusTag = 'Remote';
    let distance = -1;
    if (lat && lng) {
      distance = calculateDistance(COLLEGE_LOCATION.lat, COLLEGE_LOCATION.lng, lat, lng);
      statusTag = distance <= ALLOWED_RADIUS ? 'In-Site' : 'Remote';
    }

    // Checking Late status (e.g. after 08:30)
    const isLate = serverTime.getHours() > 8 || (serverTime.getHours() === 8 && serverTime.getMinutes() > 30);
    const status = isLate ? 'Late' : 'Present';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ป้องกันการลงเวลาเข้างานซ้ำ
    const existingAttendance = await Attendance.findOne({ userId, date: today });
    if (existingAttendance && existingAttendance.checkIn?.time) {
      return NextResponse.json({ 
        success: false, 
        message: 'คุณได้ลงเวลาเข้างานของวันนี้ไปแล้ว ไม่สามารถลงซ้ำได้' 
      }, { status: 400 });
    }

    const newCheckIn = await Attendance.findOneAndUpdate(
      { userId, date: today },
      {
        $setOnInsert: { userId, date: today, status },
        $set: {
          'checkIn.time': serverTime,
          'checkIn.location': { lat, lng, address },
          'checkIn.photoUrl': photoUrl,
          'checkIn.statusTag': statusTag,
          'checkIn.deviceId': deviceId
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: newCheckIn, distance, statusTag });
  } catch (error: any) {
    console.error("Check-in Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
