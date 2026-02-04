export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="py-24">{children}</div>
    </section>
  );
}
