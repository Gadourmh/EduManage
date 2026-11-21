"use client";

import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: "Students", value: "1,245", trend: "+8.2%" },
    { label: "Teachers", value: "112", trend: "+3.6%" },
    { label: "Courses", value: "86", trend: "+5.1%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Welcome back, <span className="font-semibold">{user?.fullName ?? "Administrator"}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label}>
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
            <p className="mt-1 text-sm text-blue-700">{item.trend} this month</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Management Overview</h2>
        <p className="mt-2 text-sm text-slate-600">
          Use the sidebar to manage users and monitor activity across departments.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
            Pending approvals: <span className="font-semibold">12 users</span>
          </div>
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
            New registrations: <span className="font-semibold">37 this week</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
