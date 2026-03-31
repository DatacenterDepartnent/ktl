import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * [GET] ดึงการตั้งค่าเวลาเข้า-ออกงานตาม Role
 */
export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role?.toLowerCase();
    
    // Consistent with middleware's admin roles
    const allowedRoles = ["super_admin", "admin", "hr", "director", "deputy_resource", "deputy_strategy", "deputy_activities", "deputy_student_affairs", "editor", "staff"];

    if (!role || !allowedRoles.includes(role)) {
      console.error(`[API/role-settings] Unauthorized Access: role=${role}`);
      return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const settings = await db.collection("role_settings").find({}).toArray();

    // ถ้ายังไม่มีข้อมูล ให้ส่งค่า Default ไปก่อน
    if (settings.length === 0) {
      const defaultSettings = [
        { role: "teacher", roleName: "ครู (Teacher)", checkInLimit: "08:00", checkOutTime: "16:30" },
        { role: "staff", roleName: "เจ้าหน้าที่ (Staff)", checkInLimit: "07:30", checkOutTime: "16:30" },
        { role: "janitor", roleName: "ภารโรง (Janitor)", checkInLimit: "07:00", checkOutTime: "16:00" },
      ];
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [PATCH] อัปเดตการตั้งค่าเวลาตาม Role
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role?.toLowerCase();
    
    // Consistent with middleware's admin roles
    const allowedRoles = ["super_admin", "admin", "hr", "director", "deputy_resource", "deputy_strategy", "deputy_activities", "deputy_student_affairs", "editor", "staff"];

    if (!userRole || !allowedRoles.includes(userRole)) {
      console.error(`[API/role-settings] Update Unauthorized: role=${userRole}`);
      return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
    }

    const { role, checkInLimit, checkOutTime, roleName } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Missing role parameter" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const result = await db.collection("role_settings").updateOne(
      { role },
      { 
        $set: { 
          checkInLimit, 
          checkOutTime, 
          roleName,
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    // บันทึก Log
    await db.collection("logs").insertOne({
      userName: (session?.user as any)?.name || "Admin",
      action: "UPDATE_ROLE_SETTINGS",
      details: `อัปเดตเวลาเข้างานของ ${roleName || role}: ${checkInLimit}`,
      timestamp: new Date(),
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      role: userRole
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
