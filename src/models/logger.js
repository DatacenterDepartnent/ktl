import clientPromise from "@/lib/db";

export async function recordLog({ userId, userName, action, details, req }) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // พยายามดึง IP จาก Header (รองรับการรันบน Vercel)
    const ip = req?.headers?.get("x-forwarded-for") || req?.ip || "unknown";

    await db.collection("logs").insertOne({
      userId,
      userName,
      action,
      details,
      ip,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Failed to record log:", err);
  }
}
