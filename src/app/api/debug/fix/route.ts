import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    
    // Find a real admin user to assign these orphan records to
    const adminUser = await db.collection("users").findOne({ $or: [{ role: "super_admin" }, { role: "admin" }] });
    if (!adminUser) return NextResponse.json({ error: "No admin found to assign records to" });

    // Update the orphan records that were hard-coded
    const result = await db.collection("attendances").updateMany(
      { userId: new ObjectId("60d0fe4f5311236168a109ca") },
      { $set: { userId: adminUser._id } }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Fixed ${result.modifiedCount} mismatched records and assigned them to ${adminUser.name || adminUser.username}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
