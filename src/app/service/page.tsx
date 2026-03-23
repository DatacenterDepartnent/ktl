import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เงื่อนไขการให้บริการ | KTLTC",
  description: "เงื่อนไขและข้อตกลงในการใช้บริการเว็บไซต์วิทยาลัยเทคนิคกันทรลักษ์",
};

const sections = [
  {
    title: "1. การยอมรับเงื่อนไข",
    content:
      "การเข้าใช้งานเว็บไซต์ของวิทยาลัยเทคนิคกันทรลักษ์ (KTLTC) ถือว่าท่านได้อ่าน ทำความเข้าใจ และยอมรับเงื่อนไขการให้บริการฉบับนี้ทุกประการ หากท่านไม่ยอมรับเงื่อนไขใดๆ กรุณาหยุดใช้งานเว็บไซต์",
  },
  {
    title: "2. วัตถุประสงค์ของเว็บไซต์",
    content:
      "เว็บไซต์นี้จัดทำขึ้นเพื่อเผยแพร่ข้อมูลข่าวสาร ประกาศ กิจกรรม และข้อมูลทางการศึกษาของวิทยาลัยเทคนิคกันทรลักษ์ เพื่อประโยชน์แก่นักเรียน ผู้ปกครอง บุคลากร และสาธารณชนทั่วไป",
  },
  {
    title: "3. ทรัพย์สินทางปัญญา",
    content:
      "เนื้อหา ข้อความ รูปภาพ โลโก้ และสื่อต่างๆ บนเว็บไซต์นี้เป็นทรัพย์สินของวิทยาลัยเทคนิคกันทรลักษ์ ห้ามทำซ้ำ ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร",
  },
  {
    title: "4. ข้อจำกัดความรับผิดชอบ",
    content:
      "วิทยาลัยฯ พยายามอย่างเต็มที่เพื่อให้ข้อมูลถูกต้องและเป็นปัจจุบัน แต่ไม่รับผิดชอบต่อความเสียหายที่เกิดจากข้อมูลที่ไม่ถูกต้อง ไม่ครบถ้วน หรือล้าสมัย รวมถึงความเสียหายที่เกิดจากการหยุดชะงักของบริการ",
  },
  {
    title: "5. การเชื่อมต่อกับเว็บไซต์ภายนอก",
    content:
      "เว็บไซต์อาจมีลิงก์ไปยังเว็บไซต์ภายนอก วิทยาลัยฯ ไม่รับผิดชอบต่อเนื้อหาหรือนโยบายของเว็บไซต์ดังกล่าว การเข้าชมเว็บไซต์ภายนอกเป็นความรับผิดชอบของผู้ใช้งานเอง",
  },
  {
    title: "6. การเปลี่ยนแปลงเงื่อนไข",
    content:
      "วิทยาลัยฯ ขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขการให้บริการนี้โดยไม่ต้องแจ้งล่วงหน้า การใช้งานต่อเนื่องหลังจากมีการเปลี่ยนแปลง ถือว่าท่านยอมรับเงื่อนไขใหม่",
  },
  {
    title: "7. กฎหมายที่ใช้บังคับ",
    content:
      "เงื่อนไขการให้บริการนี้อยู่ภายใต้บังคับของกฎหมายแห่งราชอาณาจักรไทย ข้อพิพาทที่เกิดขึ้นให้อยู่ในเขตอำนาจศาลไทย",
  },
  {
    title: "8. ติดต่อเรา",
    content:
      "หากมีข้อสงสัยเกี่ยวกับเงื่อนไขการให้บริการ กรุณาติดต่อ งานศูนย์ข้อมูลและสารสนเทศ วิทยาลัยเทคนิคกันทรลักษ์ 82 หมู่ 1 ตำบลจานใหญ่ อำเภอกันทรลักษ์ จังหวัดศรีสะเกษ 33110",
  },
];

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Hero */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            📋 Terms of Service
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            เงื่อนไขการให้บริการ
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
              <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {sec.title.replace(/^\d+\.\s/, "")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              {sec.content}
            </p>
          </div>
        ))}

        {/* Back + Policy link */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            ← กลับหน้าหลัก
          </Link>
          <Link
            href="/policy"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            นโยบายความเป็นส่วนตัว →
          </Link>
        </div>
      </div>
    </main>
  );
}
