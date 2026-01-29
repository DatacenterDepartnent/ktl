// ถ้าต้องการ Navbar สีดำด้านบนด้วย

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        <div className="text-zinc-800 py-24">
          <div>{children}</div>
        </div>
      </main>
    </>
  );
}
