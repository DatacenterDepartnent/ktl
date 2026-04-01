import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { calculateDistance } from '@/lib/geoDistance';
import { auth } from '@/lib/auth';
import { sendLineNotify } from '@/lib/lineNotify';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ObjectId } from 'mongodb';

// พิกัดวิทยาลัย KTLTC (82 หมู่ 1 ต.จานใหญ่ อ.กันทรลักษ์ จ.ศรีสะเกษ)
const COLLEGE_LOCATION = { lat: 14.754043, lng: 104.65807 };
const IN_SITE_THRESHOLD = 200; // 200 Meters
const MAX_ALLOWED_DISTANCE = 200000; // 200 Kilometers (WFH/Remote Limit)

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
      // ในระยะ 200 กิโลเมตร ระบุเป็น อยู่ในพื้นที่
      // อยู่นอกระยะ 200 กิโลเมตร ให้ระบุว่า อยู่นอกพื้นที่
      if (distance <= MAX_ALLOWED_DISTANCE) {
        statusTag = 'อยู่ในพื้นที่';
      } else {
        statusTag = 'อยู่นอกพื้นที่';
      }
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 1. ดึงข้อมูล User และ Role
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    const userRole = user?.role || "user";

    // 2. ดึงการตั้งค่าเวลาของ Role นี้ (ถ้าไม่มีให้ใช้ Default 08:00)
    const roleSetting = await db.collection("role_settings").findOne({ role: userRole });
    let limitHours = 8;
    let limitMinutes = 0;

    if (roleSetting && roleSetting.checkInLimit) {
      const [h, m] = roleSetting.checkInLimit.split(":").map(Number);
      limitHours = h;
      limitMinutes = m;
    } else {
      // Fallback สำหรับ Staff ตามเงื่อนไขใหม่ (07:30) ถ้ายังไม่ได้ตั้งค่าใน DB
      if (userRole === "staff") {
        limitHours = 7;
        limitMinutes = 30;
      }
    }
    // Thailand is UTC+7
    const thTime = new Date(serverTime.getTime() + (7 * 60 * 60 * 1000));
    const thHours = thTime.getUTCHours();
    const thMinutes = thTime.getUTCMinutes();
    const thSeconds = thTime.getUTCSeconds();
    const currentTimeVal = thHours * 100 + thMinutes;

    // ⛔ 1. ตรวจสอบช่วงเวลาปิดระบบ (18:01 - 04:59)
    if (currentTimeVal >= 1801 || currentTimeVal < 500) {
      return NextResponse.json({ 
        success: false, 
        message: 'ขณะนี้อยู่นอกเวลาให้บริการ (ระบบปิดระหว่าง 18.01 - 04.59 น.)' 
      }, { status: 403 });
    }

    // ⛔ 2. ตรวจสอบเวลาเริ่มเข้างาน (05.00)
    if (currentTimeVal < 500) {
      return NextResponse.json({ 
        success: false, 
        message: 'ยังไม่ถึงเวลาลงเวลาเข้างาน (เริ่ม 05.00 น.)' 
      }, { status: 403 });
    }

    // 3. ดึงการตั้งค่าเวลาของ Role นี้ (ถ้ามี) แต่ยึดตามกฎระบบใหม่ "หลัง 08.01 สาย"
    // ถ้าผู้ใช้ต้องการให้ยืดหยุ่นตามแผนผังเดิม ให้ใช้ limitHours/limitMinutes
    // แต่จากคำสั่ง: "หลัง 08.01 เข้างานสาย" ผมจะใช้ค่านี้เป็นหลัก
    const isLate = currentTimeVal > 801; 
    const status = isLate ? 'Late' : 'Present';

    // วันที่ของวันนี้ (เวลาประเทศไทย)
    const today = new Date(thTime);
    today.setUTCHours(0, 0, 0, 0);

    const userObjId = new ObjectId(userId);

    // ป้องกันการลงเวลาเข้างานซ้ำ
    const existingAttendance = await db.collection("attendances").findOne({ 
      userId: { $in: [userId, userObjId] }, 
      date: today 
    });

    if (existingAttendance && (existingAttendance as any).checkIn?.time) {
      return NextResponse.json({ 
        success: false, 
        message: 'คุณได้ลงเวลาเข้างานของวันนี้ไปแล้ว ไม่สามารถลงซ้ำได้' 
      }, { status: 400 });
    }

    const updateDoc = {
      $setOnInsert: { userId: userObjId, date: today, status },
      $set: {
        'checkIn.time': serverTime,
        'checkIn.location': { lat, lng, address },
        'checkIn.photoUrl': photoUrl,
        'checkIn.statusTag': statusTag,
        'checkIn.deviceId': deviceId
      }
    };

    const result = await db.collection("attendances").findOneAndUpdate(
      { userId: { $in: [userId, userObjId] }, date: today },
      updateDoc,
      { upsert: true, returnDocument: 'after' }
    );

    const newCheckIn = result;

    try {
      const user = await db.collection("users").findOne({ _id: userObjId });
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
