import Link from "next/link";
import TicketCard from "../../../(website)/(components)/TicketCard"; // เช็ค Path นี้ให้ดี
import { getAllTickets } from "@/lib/data";
import { Plus, Inbox, Hash, User, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const getTickets = async () => {
  try {
    const data = await getAllTickets();
    return data;
  } catch (error) {
    console.error("❌ Error loading topics:", error);
    return { tickets: [] };
  }
};

export default async function SubQAPage() {
  const data = await getTickets();
  // ป้องกันกรณี data เป็น null หรือไม่มี tickets
  const rawTickets = data?.tickets || [];

  // 1. เรียงลำดับ (เพิ่มการเช็ควันที่มีอยู่จริง)
  const tickets = [...rawTickets].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateA - dateB;
  });

  // 2. จัดกลุ่มข้อมูล (Category)
  const ticketsByCategory = tickets.reduce((acc: any, ticket: any) => {
    const category = ticket.category || "ทั่วไป";
    if (!acc[category]) acc[category] = [];
    acc[category].push(ticket);
    return acc;
  }, {});

  const categories = Object.keys(ticketsByCategory);

  if (tickets.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-24">
        <div className="flex w-full max-w-md flex-col items-center rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100 dark:text-black">
          <Inbox size={40} className="mb-6 text-blue-500" />
          <h3 className="text-2xl font-bold">ยังไม่มีรายการถาม-ตอบ</h3>
          <Link href="/TicketPage/new" className="mt-8 w-full">
            <button className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition-all hover:bg-blue-700">
              เริ่มตั้งคำถามแรก
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">
            Q & A <span className="text-blue-600">ถาม-ตอบ</span>
          </h1>
          <p className="text-slate-500 font-medium">
            พื้นที่แลกเปลี่ยนและตอบข้อซักถาม
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/TicketPage/new">
              <button className="flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-white shadow-2xl hover:bg-blue-600 transition-all hover:-translate-y-1 font-bold">
                <Plus size={20} /> ตั้งกระทู้ใหม่
              </button>
            </Link>
          </div>
        </header>

        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category} className="relative">
              <div className="sticky top-6 z-10 mb-10 flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-white/80 px-6 py-2 shadow-sm backdrop-blur-md border border-slate-200">
                  <Hash size={16} className="text-blue-500" />
                  <span className="font-black text-sm uppercase">
                    {category}
                  </span>
                  <span className="ml-2 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600">
                    {ticketsByCategory[category].length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                {ticketsByCategory[category].map((ticket: any) => {
                  // ✅ Logic เช็คว่าเป็น Admin หรือไม่ (เช็คจากฟิลด์ที่มีจริงใน DB ของคุณ)
                  const isAdmin =
                    ticket.authorRole === "admin" ||
                    ticket.author?.toLowerCase() === "admin";

                  return (
                    <div
                      key={ticket._id}
                      className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm mt-1 
                          ${isAdmin ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"}`}
                        >
                          {isAdmin ? (
                            <ShieldCheck size={20} />
                          ) : (
                            <User size={20} />
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={`overflow-hidden rounded-3xl shadow-sm border transition-all hover:shadow-md 
                            ${isAdmin ? "bg-blue-50 border-blue-100 rounded-tr-none" : "bg-white border-slate-100 rounded-tl-none"}`}
                          >
                            <TicketCard ticket={ticket} />
                          </div>
                          <p
                            className={`mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${isAdmin ? "text-right" : "text-left"}`}
                          >
                            {ticket.createdAt
                              ? new Date(ticket.createdAt).toLocaleString(
                                  "th-TH",
                                )
                              : ""}
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
      </div>
    </div>
  );
}
