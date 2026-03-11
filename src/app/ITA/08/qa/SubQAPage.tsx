import Link from "next/link";
import TicketCard from "../../../(website)/(components)/TicketCard";
import { getAllTickets } from "@/lib/data";
import { Plus, Inbox, Hash, User, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

// ฟังก์ชันดึงข้อมูลแยกออกมา
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
  const rawTickets = data?.tickets || [];

  // 1. เรียงลำดับจากเก่าไปใหม่ (เพื่อให้กระทู้แรกอยู่บนสุดในหมวด)
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

  // กรณีไม่มีข้อมูล
  if (tickets.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-24 min-h-[60vh]">
        <div className="flex w-full max-w-sm flex-col items-center rounded-[3rem] bg-white p-12 text-center shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
          <div className="bg-blue-50 p-6 rounded-full mb-6">
            <Inbox size={48} className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">
            No_Tickets_Found
          </h3>
          <p className="mt-2 text-slate-400 font-medium text-sm">
            ยังไม่มีรายการถาม-ตอบในขณะนี้
          </p>
          <Link href="/TicketPage/new" className="mt-10 w-full">
            <button className="w-full rounded-2xl bg-slate-900 py-4 font-black text-[11px] text-white transition-all hover:bg-blue-600 uppercase tracking-widest italic">
              Start_Conversation
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-24 font-sans">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <header className="mb-20 text-center">
          <div className="inline-block bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.3em] mb-4 italic">
            Community_Hub
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">
            Q & A <span className="text-blue-600">Protocol</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest opacity-60">
            Internal Information Exchange & Support Center
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/TicketPage/new">
              <button className="group flex items-center gap-3 rounded-2xl bg-slate-900 px-10 py-4 text-white shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-all hover:-translate-y-1 font-black uppercase text-[11px] tracking-widest italic">
                <Plus
                  size={18}
                  className="group-hover:rotate-90 transition-transform"
                />
                Post_New_Ticket
              </button>
            </Link>
          </div>
        </header>

        <div className="space-y-24">
          {categories.map((category) => (
            <div key={category} className="relative">
              {/* Category Header */}
              <div className="sticky top-6 z-10 mb-12 flex justify-center">
                <div className="flex items-center gap-3 rounded-full bg-white/90 px-8 py-3 shadow-xl shadow-slate-200/50 backdrop-blur-xl border border-white/50 ring-1 ring-slate-100">
                  <Hash size={16} className="text-blue-500 animate-pulse" />
                  <span className="font-black text-xs uppercase tracking-tighter italic text-slate-900">
                    {category}
                  </span>
                  <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
                  <span className="text-[10px] font-black text-blue-600 tabular-nums">
                    {ticketsByCategory[category].length
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex flex-col gap-10">
                {ticketsByCategory[category].map((ticket: any) => {
                  // เช็ค Role จาก DB
                  const isAdmin =
                    ticket.authorRole === "admin" ||
                    ticket.authorRole === "super_admin";

                  return (
                    <div
                      key={ticket._id}
                      className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[92%] md:max-w-[85%] gap-4 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar พร้อม Indicator */}
                        <div className="relative shrink-0">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg mt-1 transition-transform hover:scale-110
                            ${isAdmin ? "bg-slate-900 text-blue-400" : "bg-white text-slate-400 border border-slate-100"}`}
                          >
                            {isAdmin ? (
                              <ShieldCheck size={24} />
                            ) : (
                              <User size={24} />
                            )}
                          </div>
                          {isAdmin && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
                            </span>
                          )}
                        </div>

                        {/* Card Content */}
                        <div
                          className={`flex-1 min-w-0 ${isAdmin ? "text-right" : "text-left"}`}
                        >
                          <div className="mb-2 flex items-center gap-2 px-1">
                            <span
                              className={`text-[10px] font-black uppercase italic tracking-widest ${isAdmin ? "text-blue-600 ml-auto" : "text-slate-400"}`}
                            >
                              {isAdmin
                                ? "Authorized_Officer"
                                : ticket.author || "Guest_User"}
                            </span>
                          </div>
                          <div
                            className={`overflow-hidden rounded-[2rem] shadow-xl shadow-slate-200/40 border transition-all hover:shadow-2xl hover:shadow-blue-200/20
                            ${isAdmin ? "bg-white border-blue-100 rounded-tr-none" : "bg-white border-slate-100 rounded-tl-none"}`}
                          >
                            <TicketCard ticket={ticket} />
                          </div>
                          <p className="mt-3 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic tabular-nums">
                            {ticket.createdAt
                              ? new Date(ticket.createdAt).toLocaleString(
                                  "th-TH",
                                )
                              : "STAMP_PENDING"}
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
