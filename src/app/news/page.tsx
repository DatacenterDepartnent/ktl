import clientPromise from "@/lib/db";
import Navbar from "@/components/Navbar";
import NewsListClient from "@/components/NewsListClient";

// ฟังก์ชันดึงข่าว (ทำงานฝั่ง Server)
async function getNews() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const news = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return JSON.parse(JSON.stringify(news));
  } catch {
    return [];
  }
}

export default async function AllNewsPage() {
  const newsList = await getNews();

  return (
    // เปลี่ยนพื้นหลังเป็นสีขาวนวล (Slate-50) ให้เข้ากับ Client Component
    <main className="   ">
      <Navbar />

      {/* ลบ Header ส่วน Server ทิ้ง 
        เพราะเราย้าย Header + Filter ไปไว้ใน NewsListClient แล้ว 
        เพื่อความสวยงามและการจัด Layout ที่เป็นอันหนึ่งอันเดียวกัน 
      */}

      <div className="pt-20 md:pt-24">
        <NewsListClient initialNews={newsList} />
      </div>
    </main>
  );
}
