// ไฟล์: src/app/dashboard/layout.tsx
import Navbar from "@/components/Navbar"; // ✅ Navbar ทำงานบน Server ได้ปกติที่นี่

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <section className="max-w-7xl mx-auto ">
    <section>
      <Navbar />
      <main>{children}</main>
    </section>
  );
}
