import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  // ตั้งค่าเพิ่มเติมเพื่อความเสถียร (Optional)
  maxPoolSize: 10,
  minPoolSize: 5,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

/**
 * ฟังก์ชันสำหรับสร้าง Index อัตโนมัติ
 * ช่วยแก้ปัญหา Performance (LCP/FCP) โดยเฉพาะการดึง Log และ Login
 */
async function createIndexes(promise: Promise<MongoClient>) {
  try {
    const client = await promise;
    const db = client.db("ktltc_db");

    // 1. Index สำหรับ Audit Log (เรียงลำดับเวลาล่าสุด)
    await db.collection("logs").createIndex({ timestamp: -1 });

    // 2. Index สำหรับ Users (ค้นหา username ได้รวดเร็วและห้ามซ้ำ)
    await db.collection("users").createIndex({ username: 1 }, { unique: true });

    // 3. Index สำหรับการจัดลำดับ User ในหน้า Dashboard
    await db.collection("users").createIndex({ orderIndex: 1 });

    console.log("✅ [MongoDB] Indexes created/verified successfully");
  } catch (error) {
    console.error("❌ [MongoDB] Index creation error:", error);
  }
}

if (process.env.NODE_ENV === "development") {
  // ในโหมด Development ใช้ global variable เพื่อไม่ให้ connect ซ้ำซ้อนตอน Hot Reload
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
    // รันการสร้าง Index เฉพาะครั้งแรกที่เริ่มโปรเจกต์
    createIndexes(globalWithMongo._mongoClientPromise);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // ในโหมด Production สร้าง connection ใหม่ปกติ
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  // รันการสร้าง Index เพื่อความชัวร์ในฝั่ง Production
  createIndexes(clientPromise);
}

export default clientPromise;
