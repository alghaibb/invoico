const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex items-center justify-center w-full min-h-screen p-4 bg-muted">
      <div className="w-full max-w-7xl mx-auto bg-white shadow-md p-8 mt-24 md:mt-32">
        {children}
      </div>
    </section>
  );
};

export default MainLayout;
