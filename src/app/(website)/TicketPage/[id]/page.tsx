import EditTicketForm from "@/app/(website)/(components)/EditTicketForm";
import { getTicketById } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>; // แก้ไข: รองรับ Next.js 15+ Async Params
}) {
  // 1. ดึง ID ออกมาจาก Promise
  const { id } = await params;
  const EDITMODE = id !== "new";

  // 🛠 2. จำลองสิทธิ์ (เปลี่ยนเป็น Logic จริงของคุณ เช่นจาก NextAuth)
  const userRole = "editor"; // หรือ "admin" ให้ตรงกับหน้า SubQAPage

  // 🛠 3. ระบบป้องกัน (Access Control)
  const allowedRoles = ["editor", "admin", "super_admin"];

  // บล็อกเฉพาะกรณีจะ "แก้ไข/ตอบ" แต่สิทธิ์ไม่ถึง
  if (EDITMODE && !allowedRoles.includes(userRole)) {
    redirect("/ITA/08/qa");
  }

  let ticketData: any = {};

  if (EDITMODE) {
    const response = await getTicketById(id);
    if (!response || !response.ticket) {
      redirect("/ITA/08/qa");
    }
    ticketData = response.ticket; // บรรทัดนี้ต้องเก็บค่าไว้ส่งให้ Form
  } else {
    // สำหรับการสร้างใหม่ (id === "new")
    ticketData = {
      _id: "new",
      title: "",
      description: "",
      category: "ทั่วไป",
    };
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <EditTicketForm ticket={ticketData} userRole={userRole} />
    </div>
  );
}
