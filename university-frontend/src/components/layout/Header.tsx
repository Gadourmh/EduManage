"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import { Button, LinkButton } from "../ui/Button";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-slate-900 transition hover:text-blue-700"
        >
          EduManage
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">{user.fullName}</p>
                <p className="text-xs capitalize text-slate-500">{user.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <LinkButton href="/login" variant="secondary" size="sm">
                Login
              </LinkButton>
              <LinkButton href="/register" size="sm">
                Register
              </LinkButton>
            </>
          )}
        </div>
      </div>

      <nav className="flex items-center justify-center gap-5 border-t border-slate-200 py-3 md:hidden">
        {navItems.map((item) => (
          <Link
            key={`mobile-${item.label}`}
            href={item.href}
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
