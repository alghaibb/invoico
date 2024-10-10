"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { accountsPageLinks } from "@/constants";
import { cn } from "@/lib/utils";

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full p-4 md:w-64 md:p-6">
      <nav>
        <ul className="space-y-2">
          {accountsPageLinks.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <span
                  className={cn(
                    "block p-2 rounded-md transition-all duration-300 ease-in-out transform hover:bg-muted hover:scale-105",
                    pathname === item.href ? "bg-muted scale-105" : ""
                  )}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
