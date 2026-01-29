export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div
        className="
  px-4
      "
      >
        {children}
      </div>
    </section>
  );
}
