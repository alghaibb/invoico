import { Separator } from "@/components/ui/separator";

import SidebarNav from "./SideNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 md:flex-shrink-0">
        <SidebarNav />
      </div>

      {/* Vertical separator for desktop */}
      <Separator orientation="vertical" className="hidden h-auto md:block" />

      {/* Horizontal separator for mobile */}
      <Separator orientation="horizontal" className="block my-2 md:hidden" />

      {/* Main content */}
      <div className="flex-1 mt-4 md:p-6 md:mt-0">{children}</div>
    </div>
  );
}
