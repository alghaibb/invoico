const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex items-center justify-center w-full min-h-screen p-4 bg-muted">
      <div className="w-full p-8 mx-auto mt-24 bg-white shadow-md max-w-7xl md:mt-32">
        {children}
      </div>
    </section>
  );
};

export default MainLayout;
