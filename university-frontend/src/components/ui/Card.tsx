import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
