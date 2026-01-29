export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className=" py-8">{children}</div>
    </section>
  );
}
