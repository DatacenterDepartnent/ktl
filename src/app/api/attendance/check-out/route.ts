import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please login again.' }, { status: 401 });
    }

    const data = await req.json();
    const { lat, lng, photoUrl, address } = data;

    const serverTime = new Date();
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userObjId = new ObjectId(userId);

    const existingAttendance = await db.collection("attendances").findOne({ 
      userId: { $in: [userId, userObjId] }, 
      date: today 
    });
    
    // ตรวจสอบว่าเช็คอินหรือยัง
    if (!existingAttendance || !(existingAttendance as any).checkIn?.time) {
      return NextResponse.json({ 
        success: false, 
        message: 'ไม่พบข้อมูลเข้างาน กรุณาลงเวลาเข้างานก่อนครับ' 
      }, { status: 400 });
    }

    // ป้องกันการลงเวลาออกงานซ้ำ
    if ((existingAttendance as any).checkOut?.time) {
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

    const result = await db.collection("attendances").findOneAndUpdate(
      { userId: { $in: [userId, userObjId] }, date: today },
      {
        $set: {
          'checkOut.time': serverTime,
          'checkOut.location': { lat, lng, address },
          'checkOut.photoUrl': photoUrl,
          'checkOut.otHours': otHours
        }
      },
      { returnDocument: 'after' }
    );

    const updatedCheckOut = result;

    if (!updatedCheckOut) {
      return NextResponse.json({ success: false, message: 'No check-in record found for today.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCheckOut, otHours });
  } catch (error: any) {
    console.error("Check-out Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
