/* eslint-disable react/no-unescaped-entities */
// import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      {/* --- หัวข้อหน้า --- */}
      <div className="flex items-center gap-3 mb-10 border-b border-zinc-100 pb-4">
        <span className="text-3xl">🏫</span>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-800">
          เกี่ยวกับสถานศึกษา
        </h2>
      </div>

      {/* 1. ส่วนประวัติ (แบ่งซ้าย-ขวา) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-start">
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
            ประวัติความเป็นมา
          </h3>
          <p className="text-zinc-600 leading-relaxed mb-4 text-lg">
            วิทยาลัยเทคนิคกันทรลักษ์ เดิมชื่อ "วิทยาลัยการอาชีพกันทรลักษ์"
            ได้จัดตั้งขึ้นตามนโยบายรัฐบาล
            เพื่อขยายโอกาสทางการศึกษาวิชาชีพสู่ชนบท จังหวัดศรีสะเกษ
            โดยมุ่งเน้นการพัฒนาทักษะฝีมือแรงงาน ให้มีคุณภาพและได้มาตรฐานสากล
          </p>
          <p className="text-zinc-600 leading-relaxed text-lg">
            ปัจจุบันเปิดทำการสอนในระดับ ปวช. และ ปวส.
            หลากหลายสาขาวิชาช่างอุตสาหกรรม และพาณิชยกรรม
            เพื่อตอบสนองความต้องการของตลาดแรงงานในยุคดิจิทัล
            และพัฒนาท้องถิ่นอย่างยั่งยืน
          </p>
        </div>

        {/* กรอบรูปภาพประกอบ */}
        <div className="relative h-64 md:h-80 bg-zinc-100 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 group">
          {/* คุณสามารถเอารูปอาคารมาใส่ที่ public/building.jpg แล้ว uncomment บรรทัดล่างได้เลย */}
          {/* <Image src="/building.jpg" fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt="อาคารเรียน" /> */}

          <div className="flex flex-col items-center justify-center h-full text-zinc-400 font-medium">
            <span className="text-4xl mb-2">🏢</span>
            <span>(วางรูปภาพอาคารเรียนที่นี่)</span>
          </div>
        </div>
      </section>

      {/* 2. วิสัยทัศน์ & พันธกิจ (Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Card: วิสัยทัศน์ */}
        <div className="bg-linear-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-5">👁️</div>
          <div className="relative z-10">
            <div className="text-4xl mb-4 bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
              👁️
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              วิสัยทัศน์ (Vision)
            </h3>
            <p className="text-blue-900/70 leading-relaxed text-lg">
              "มุ่งผลิตกำลังคนอาชีวศึกษา ให้มีคุณภาพมาตรฐานสากล มีคุณธรรม
              จริยธรรม และมีจิตอาสาเพื่อพัฒนาสังคม"
            </p>
          </div>
        </div>

        {/* Card: พันธกิจ */}
        <div className="bg-linear-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-5">🎯</div>
          <div className="relative z-10">
            <div className="text-4xl mb-4 bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
              🎯
            </div>
            <h3 className="text-xl font-bold text-orange-800 mb-2">
              พันธกิจ (Mission)
            </h3>
            <ul className="list-disc list-inside text-orange-900/70 leading-relaxed space-y-2 text-lg">
              <li>จัดการศึกษาเพื่อเสริมสร้างสมรรถนะวิชาชีพ</li>
              <li>ส่งเสริมการวิจัยและนวัตกรรมสิ่งประดิษฐ์</li>
              <li>บริการวิชาการและวิชาชีพสู่ชุมชน</li>
              <li>ทำนุบำรุงศิลปวัฒนธรรมและสิ่งแวดล้อม</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. อัตลักษณ์ & เอกลักษณ์ */}
      <section className="bg-zinc-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden mb-20">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 text-center md:text-left items-center">
          <div className="border-b md:border-b-0 md:border-r border-zinc-700 pb-8 md:pb-0 md:pr-8">
            <h3 className="text-blue-400 font-bold text-lg mb-2 uppercase tracking-widest">
              อัตลักษณ์ (Identity)
            </h3>
            <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-400">
              "บริการดี มีวินัย
              <br />
              ใฝ่เรียนรู้"
            </p>
          </div>
          <div className="md:pl-8">
            <h3 className="text-purple-400 font-bold text-lg mb-2 uppercase tracking-widest">
              เอกลักษณ์ (Uniqueness)
            </h3>
            <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-400">
              "สถานศึกษาแห่งความสุข
              <br />
              และบริการชุมชน"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
