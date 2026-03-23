import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว | KTLTC",
  description: "นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของวิทยาลัยเทคนิคกันทรลักษ์",
};

const sections = [
  {
    title: "1. ข้อมูลที่เราเก็บรวบรวม",
    content:
      "เราอาจเก็บรวบรวมข้อมูลส่วนบุคคล เช่น ชื่อ-นามสกุล อีเมล หมายเลขโทรศัพท์ เมื่อท่านกรอกแบบฟอร์มติดต่อหรือสมัครใช้บริการต่างๆ บนเว็บไซต์ รวมถึงข้อมูลการใช้งาน เช่น IP Address, ประเภทเบราว์เซอร์ และหน้าที่เข้าชม",
  },
  {
    title: "2. วัตถุประสงค์การใช้ข้อมูล",
    content:
      "ข้อมูลที่เก็บรวบรวมจะถูกนำไปใช้เพื่อการให้บริการและปรับปรุงเว็บไซต์ การติดต่อสื่อสารกับท่าน การวิเคราะห์สถิติการใช้งาน และการปฏิบัติตามกฎหมายที่เกี่ยวข้อง เช่น พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)",
  },
  {
    title: "3. การใช้คุกกี้ (Cookies)",
    content:
      "เว็บไซต์ใช้คุกกี้เพื่อพัฒนาประสบการณ์ใช้งาน จดจำการตั้งค่าของท่าน และวิเคราะห์การเข้าชม ท่านสามารถตั้งค่าเบราว์เซอร์เพื่อปฏิเสธคุกกี้ได้ แต่อาจส่งผลต่อการใช้งานบางฟีเจอร์ของเว็บไซต์",
  },
  {
    title: "4. การเปิดเผยข้อมูลแก่บุคคลภายนอก",
    content:
      "วิทยาลัยฯ จะไม่ขาย เช่า หรือเปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอก ยกเว้นกรณีที่ได้รับความยินยอม หรือเป็นการปฏิบัติตามคำสั่งศาลหรือกฎหมายที่เกี่ยวข้อง",
  },
  {
    title: "5. ความปลอดภัยของข้อมูล",
    content:
      "เราใช้มาตรการทางเทคนิคและองค์กรที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของท่านจากการเข้าถึง ใช้งาน หรือเปิดเผยโดยไม่ได้รับอนุญาต อย่างไรก็ตาม ไม่มีวิธีการส่งข้อมูลทางอินเทอร์เน็ตใดที่ปลอดภัย 100%",
  },
  {
    title: "6. สิทธิ์ของเจ้าของข้อมูล",
    content:
      "ท่านมีสิทธิ์เข้าถึง แก้ไข ลบ หรือคัดค้านการประมวลผลข้อมูลส่วนบุคคลของท่าน ตลอดจนสิทธิ์ในการโอนย้ายข้อมูล ตามที่กำหนดไว้ใน พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562",
  },
  {
    title: "7. การเก็บรักษาข้อมูล",
    content:
      "เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านตราบเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ระบุไว้ หรือตามที่กฎหมายกำหนด เมื่อหมดความจำเป็นจะทำลายข้อมูลด้วยวิธีที่ปลอดภัย",
  },
  {
    title: "8. การเปลี่ยนแปลงนโยบาย",
    content:
      "เราขอสงวนสิทธิ์ในการปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว โดยจะแสดงวันที่อัปเดตล่าสุดไว้บนหน้านี้ การใช้งานเว็บไซต์ต่อเนื่องถือว่ายอมรับนโยบายที่แก้ไข",
  },
  {
    title: "9. ติดต่อเจ้าหน้าที่คุ้มครองข้อมูล",
    content:
      "หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวหรือต้องการใช้สิทธิ์ของท่าน กรุณาติดต่อ งานศูนย์ข้อมูลและสารสนเทศ วิทยาลัยเทคนิคกันทรลักษ์ 82 หมู่ 1 ตำบลจานใหญ่ อำเภอกันทรลักษ์ จังหวัดศรีสะเกษ 33110",
  },
];

export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Hero */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            🔒 Privacy Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม 2568 | วิทยาลัยเทคนิคกันทรลักษ์
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {sections.map((sec, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-6 shadow-sm"
          >
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {sec.title.replace(/^\d+\.\s/, "")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              {sec.content}
            </p>
          </div>
        ))}

        {/* Back + Service link */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            ← กลับหน้าหลัก
          </Link>
          <Link
            href="/service"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            เงื่อนไขการให้บริการ →
          </Link>
        </div>
      </div>
    </main>
  );
}
