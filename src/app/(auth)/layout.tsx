const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex items-center justify-center w-full md:h-screen mt-24">
      {children}
    </section>
  );
};

export default AuthLayout;
