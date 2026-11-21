"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { Sidebar, SidebarItem } from "@/components/dashboard/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function TeacherLayout({ children }: { readonly children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  const menuItems: SidebarItem[] = [
    { label: "Teacher Area", href: "/teacher/dashboard" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <p className="text-sm text-slate-600">Loading session...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr]">
      <Sidebar title="Teacher Panel" items={menuItems} />
      <main className="min-w-0">{children}</main>
    </div>
  );
}
