import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { calculateDistance } from '@/lib/geoDistance';
import { auth } from '@/lib/auth';
import User from '@/models/User';
import { sendLineNotify } from '@/lib/lineNotify';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// สมมติพิกัดวิทยาลัย (College Location)
// พิกัดวิทยาลัย KTLTC
const COLLEGE_LOCATION = { lat: 14.636681, lng: 104.6469 };
const ALLOWED_RADIUS = 500; // 500 meters (0.5 km)

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please login again.' }, { status: 401 });
    }

    const data = await req.json();
    const { lat, lng, photoUrl, deviceId, address } = data;

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

    try {
      const user = await User.findById(userId);
      const userName = user?.name || user?.username || "พนักงาน";
      const timeStr = format(serverTime, 'HH:mm', { locale: th });
      const statusEmoji = status === "Late" ? "⚠️" : "✅";
      const lineMessage = `\n${statusEmoji} แจ้งเข้างาน\nพนักงาน: ${userName}\nเวลาเข้า: ${timeStr} น.\nพิกัด: ${statusTag} (${address || 'ไม่ระบุ'})`;
      await sendLineNotify(lineMessage);
    } catch (lineErr) {
      console.error("Line Notify fail:", lineErr);
    }

    return NextResponse.json({ success: true, data: newCheckIn, distance, statusTag });
  } catch (error: any) {
    console.error("Check-in Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
