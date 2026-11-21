import "./globals.css";
import type { Metadata } from "next";

import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "EduManage",
  description: "Plateforme de gestion scolaire et universitaire",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
