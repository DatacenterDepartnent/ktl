import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const { userId, lat, lng, photoUrl, address } = data;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    const serverTime = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({ userId, date: today });
    
    // ตรวจสอบว่าเช็คอินหรือยัง
    if (!existingAttendance || !existingAttendance.checkIn?.time) {
      return NextResponse.json({ 
        success: false, 
        message: 'ไม่พบข้อมูลเข้างาน กรุณาลงเวลาเข้างานก่อนครับ' 
      }, { status: 400 });
    }

    // ป้องกันการลงเวลาออกงานซ้ำ
    if (existingAttendance.checkOut?.time) {
      return NextResponse.json({ 
        success: false, 
        message: 'คุณได้ลงเวลาออกงานของวันนี้ไปแล้ว ไม่สามารถลงซ้ำได้' 
      }, { status: 400 });
    }

    // Calculate OT (Overtime) - assumes standard end time is 16:30
    const standardEndOfDay = new Date(serverTime);
    standardEndOfDay.setHours(16, 30, 0, 0);

    let otHours = 0;
    if (serverTime.getTime() > standardEndOfDay.getTime()) {
      const diffInMs = serverTime.getTime() - standardEndOfDay.getTime();
      otHours = Number((diffInMs / (1000 * 60 * 60)).toFixed(2));
    }

    const updatedCheckOut = await Attendance.findOneAndUpdate(
      { userId, date: today },
      {
        $set: {
          'checkOut.time': serverTime,
          'checkOut.location': { lat, lng, address },
          'checkOut.photoUrl': photoUrl,
          'checkOut.otHours': otHours
        }
      },
      { new: true }
    );

    if (!updatedCheckOut) {
      return NextResponse.json({ success: false, message: 'No check-in record found for today.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCheckOut, otHours });
  } catch (error: any) {
    console.error("Check-out Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
