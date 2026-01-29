export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <div className="text-zinc-800">
          <div>{children}</div>
        </div>
      </main>
    </>
  );
}
