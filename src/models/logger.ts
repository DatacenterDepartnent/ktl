import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function recordLog({
  userId,
  userName,
  action,
  details,
  req,
}: any) {
  const client = await clientPromise;
  const db = client.db("ktltc_db");

  // บันทึกกิจกรรมลงใน Collection "logs"
  await db.collection("logs").insertOne({
    userId: new ObjectId(userId),
    userName,
    action, // LOGIN, UPDATE_USER_INFO, CHANGE_ROLE, etc.
    details,
    timestamp: new Date(),
    ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
  });

  // อัปเดตเวลาใช้งานล่าสุด (lastActive) ใน Collection "users" เพื่อใช้คำนวณระยะเวลาในระบบ
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { lastActive: new Date() } },
    );
}
