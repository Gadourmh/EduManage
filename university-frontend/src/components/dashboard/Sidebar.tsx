"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

export interface SidebarItem {
  label: string;
  href: string;
}

interface SidebarProps {
  title: string;
  items: SidebarItem[];
}

export function Sidebar({ title, items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:w-72">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
