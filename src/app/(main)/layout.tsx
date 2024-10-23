export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-center justify-center w-full min-h-screen md:p-4">
      <div className="w-full p-8 mx-auto mt-24 rounded max-w-7xl md:mt-32">
        {children}
      </div>
    </section>
  );
}
