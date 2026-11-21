import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6">
      <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-600 sm:flex-row">
        <p>© {new Date().getFullYear()} EduManage. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="transition hover:text-slate-900">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition hover:text-slate-900">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
