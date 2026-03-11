import Link from "next/link";
import TicketCard from "../../../(website)/(components)/TicketCard";
import { getAllTickets } from "@/lib/data";
import { Plus, Hash, User, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubQAPage() {
  const data = await getAllTickets();
  const tickets = (data?.tickets || []).sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // 🛠️ จำลองสิทธิ์แอดมิน
  const userRole = "editor";
  const hasAccess = ["editor", "admin", "super_admin"].includes(userRole);

  const ticketsByCategory = tickets.reduce((acc: any, ticket: any) => {
    const category = ticket.category || "ทั่วไป";
    if (!acc[category]) acc[category] = [];
    acc[category].push(ticket);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <header className="mb-20 text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-10 italic uppercase">
            Q & A <span className="text-blue-600">Protocol</span>
          </h1>
          <Link href="/TicketPage/new">
            <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase italic hover:bg-blue-600 transition-all">
              + Post_New_Ticket
            </button>
          </Link>
        </header>

        {Object.keys(ticketsByCategory).map((category) => (
          <div key={category} className="mb-20">
            <div className="flex justify-center mb-10">
              <span className="bg-white px-6 py-2 rounded-full shadow-sm font-black text-xs uppercase italic border border-slate-100">
                # {category} ({ticketsByCategory[category].length})
              </span>
            </div>

            <div className="space-y-6">
              {ticketsByCategory[category].map((ticket: any) => (
                <div key={ticket._id} className="flex gap-4">
                  {/* แสดง Link เฉพาะแอดมิน */}
                  {hasAccess ? (
                    <Link
                      href={`/TicketPage/${ticket._id}`}
                      className="flex-1 group"
                    >
                      <div className="bg-white rounded-[2rem] border-2 border-transparent group-hover:border-blue-500 transition-all shadow-xl overflow-hidden">
                        <TicketCard ticket={ticket} />
                        <div className="bg-blue-600 py-2 text-center text-[10px] font-black text-white italic">
                          AUTHORIZED_ACCESS: CLICK_TO_REPLY
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex-1 bg-white rounded-[2rem] shadow-md overflow-hidden">
                      <TicketCard ticket={ticket} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
