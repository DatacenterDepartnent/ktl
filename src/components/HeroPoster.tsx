// src/components/HeroPoster.tsx
import Image from "next/image";

async function getActivePoster() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posters`,
    {
      cache: "no-store",
    },
  );
  const posters = await res.json();
  // กรองเอาเฉพาะอันที่ isActive และเอาอันล่าสุด (index 0)
  return posters.find((p: any) => p.isActive) || null;
}

export default async function HeroPoster() {
  const poster = await getActivePoster();

  if (!poster) return null; // ถ้าไม่มีโปสเตอร์ที่เปิดใช้งาน ไม่ต้องแสดงอะไรเลย

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center">
        {/* ส่วนรูปภาพ */}
        <div className="relative w-full md:w-1/2 aspect-[3/4]">
          <Image
            src={poster.imageUrl}
            alt={poster.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* ส่วนข้อความ */}
        <div className="w-full md:w-1/2 p-10 md:p-16 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm">
              ประชาสัมพันธ์พิเศษ
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight">
              {poster.title}
            </h2>
          </div>

          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
            {poster.description}
          </p>

          <div className="pt-4">
            <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
