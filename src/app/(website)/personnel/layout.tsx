export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="py-24 px-4 container">{children}</div>
    </section>
  );
}
