import Link from "next/link";
import TicketCard from "../../../(website)/(components)/TicketCard";
import { getAllTickets } from "@/lib/data";
import { Plus, Inbox, Sparkles, Hash, User, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const getTickets = async () => {
  try {
    const data = await getAllTickets();
    return data;
  } catch (error) {
    console.error("❌ Error loading topics in Page:", error);
    return { tickets: [] };
  }
};

export default async function SubQAPage() {
  const data = await getTickets();
  let tickets = data?.tickets || [];

  // เรียงลำดับ: เก่า -> ใหม่ (เพื่อให้ดูเหมือนบทสนทนาไหลลงมา)
  // หรือ ใหม่ -> เก่า ตามเดิมก็ได้ แต่ Chat มักจะเอาอันใหม่ไว้ล่างสุด
  tickets = tickets.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // จัดกลุ่มข้อมูล
  const ticketsByCategory = tickets.reduce((acc, ticket) => {
    const category = ticket.category || "ทั่วไป";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ticket);
    return acc;
  }, {});

  const categories = Object.keys(ticketsByCategory);

  // --- กรณีไม่มีข้อมูล ---
  if (!tickets.length) {
    return (
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-slate-50/50 px-4">
        <div className="flex w-full max-w-md flex-col items-center rounded-3xl bg-white p-10 text-center shadow-2xl shadow-blue-900/5 ring-1 ring-slate-100">
          <Inbox size={40} className="mb-6 text-blue-500" strokeWidth={1.5} />
          <h3 className="text-2xl font-bold text-slate-800">ยังไม่มีรายการ</h3>
          <Link href="/TicketPage/new" className="mt-8 w-full">
            <button className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg hover:bg-blue-700">
              สร้างรายการใหม่
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Q & A <span className="text-blue-600">ถาม-ตอบ</span>
          </h1>
          <p className="text-slate-600">พื้นที่แลกเปลี่ยนความคิดเห็น</p>
          <div className="mt-8 flex justify-center">
            <Link href="/TicketPage/new">
              <button className="flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1">
                <Plus size={20} /> ตั้งกระทู้ใหม่
              </button>
            </Link>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-16">
          {categories.map((category) => (
            <div key={`category-${category}`} className="relative">
              {/* Category Label */}
              <div className="sticky top-4 z-10 mb-8 flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-2 shadow-sm backdrop-blur-md border border-slate-200 text-slate-600">
                  <Hash size={16} className="text-blue-500" />
                  <span className="font-bold">{category}</span>
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {ticketsByCategory[category].length}
                  </span>
                </div>
              </div>

              {/* ✅ เปลี่ยนจาก Grid เป็น Flex Column เพื่อจัดซ้าย/ขวา */}
              <div className="flex flex-col gap-6">
                {ticketsByCategory[category].map((ticket) => {
                  // 💡 Logic ตรวจสอบว่าเป็น Admin หรือคำตอบหรือไม่
                  // ปรับเงื่อนไขตรงนี้ให้ตรงกับข้อมูลจริงใน DB ของคุณ
                  const isAdminOrAnswer =
                    ticket.role === "admin" ||
                    ticket.title?.toLowerCase().includes("admin") ||
                    ticket.author?.toLowerCase() === "admin";

                  return (
                    <div
                      key={ticket._id || ticket.id}
                      className={`flex w-full ${isAdminOrAnswer ? "justify-end" : "justify-start"}`}
                    >
                      {/* Avatar & Card Container */}
                      <div
                        className={`flex max-w-[90%] md:max-w-[70%] gap-3 ${isAdminOrAnswer ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm mt-1
                          ${isAdminOrAnswer ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-100"}`}
                        >
                          {isAdminOrAnswer ? (
                            <ShieldCheck size={20} />
                          ) : (
                            <User size={20} />
                          )}
                        </div>

                        {/* Ticket Card Wrapper */}
                        <div className="flex-1">
                          {/* ใส่ Card ไว้ข้างใน */}
                          <div
                            className={`overflow-hidden rounded-2xl shadow-sm border transition-all hover:shadow-md
                             ${
                               isAdminOrAnswer
                                 ? "bg-blue-50 border-blue-100 rounded-tr-none" // Admin สีฟ้าอ่อน
                                 : "bg-white border-slate-100 rounded-tl-none" // User สีขาว
                             }`}
                          >
                            {/* ส่ง prop ไปบอก Card ว่าเป็นแบบย่อ หรือใช้ Card เดิม */}
                            <TicketCard
                              id={ticket._id || ticket.id}
                              ticket={ticket}
                            />
                          </div>

                          {/* Timestamp (Optional) */}
                          <p
                            className={`mt-1 text-xs text-slate-400 ${isAdminOrAnswer ? "text-right" : "text-left"}`}
                          >
                            {new Date(ticket.createdAt).toLocaleTimeString(
                              "th-TH",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center text-sm text-slate-400">
          สิ้นสุดรายการ
        </div>
      </div>
    </div>
  );
}
