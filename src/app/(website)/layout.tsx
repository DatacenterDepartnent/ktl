import Navbar from "@/components/Navbar"; // ถ้าต้องการ Navbar สีดำด้านบนด้วย

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        <Navbar />
        <div className="bg-white text-zinc-800 font-sans py-24">
          <div>{children}</div>
        </div>
      </main>
    </>
  );
}
