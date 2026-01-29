// ถ้าต้องการ Navbar สีดำด้านบนด้วย

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        <div className=" ">
          <div>{children}</div>
        </div>
      </main>
    </>
  );
}
