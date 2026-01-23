/* eslint-disable @typescript-eslint/no-explicit-any */
// ไฟล์: src/app/actions.ts
"use server";

import clientPromise from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function incrementVisitor() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    await db
      .collection("site_stats")
      .findOneAndUpdate(
        { _id: "visitor_count" as any },
        { $inc: { count: 1 } },
        { upsert: true },
      );

    // สั่งให้หน้าเว็บรู้ว่าข้อมูลเปลี่ยนแล้ว (เพื่อให้เลขขยับเมื่อรีเฟรชครั้งหน้า)
    revalidatePath("/");

    console.log("✅ Visitor count +1"); // ดูใน Terminal ว่าขึ้นข้อความนี้ไหม
  } catch (error) {
    console.error("❌ Error incrementing visitor:", error);
  }
}
