import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    let attCounts: any = {};
    if (names.includes('attendances')) {
      attCounts['attendances'] = await db.collection('attendances').countDocuments();
    }
    if (names.includes('attendance')) {
      attCounts['attendance'] = await db.collection('attendance').countDocuments();
    }

    return NextResponse.json({ collections: names, counts: attCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
