import Log from "@/models/Log";
import dbConnect from "@/lib/mongodb";

export async function recordLog({ userId, userName, action, details, req }) {
  await dbConnect();

  // พยายามดึง IP จาก Header (รองรับการรันบน Vercel)
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";

  await Log.create({
    userId,
    userName,
    action,
    details,
    ip,
  });
}
