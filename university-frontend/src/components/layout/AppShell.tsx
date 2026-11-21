"use client";

import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <Header />

        <main className="flex flex-1 items-center justify-center py-10">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
