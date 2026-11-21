import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

const features = [
  {
    title: "Student Management",
    description: "Centralize enrollment, records, and performance tracking in one secure place.",
  },
  {
    title: "Teacher Management",
    description: "Assign courses, manage workloads, and streamline academic operations.",
  },
  {
    title: "Grade Tracking",
    description: "Track assessments and view real-time grade progression with clear insights.",
  },
];

export default function HomePage() {
  return (
    <div className="w-full space-y-16 pb-8">
      <section className="grid items-center gap-10 rounded-3xl bg-gradient-to-br from-blue-50 to-white p-8 shadow-sm md:grid-cols-2 md:p-12">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            University Management Platform
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Welcome to EduManage
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            A modern platform designed to simplify student, teacher, course, and grade management
            for institutions of all sizes.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <LinkButton href="/register" size="lg">
              Get Started
            </LinkButton>
            <LinkButton href="/login" variant="secondary" size="lg">
              Login
            </LinkButton>
          </div>
        </div>

        <Card className="bg-white/90">
          <h2 className="text-lg font-semibold text-slate-900">Platform Highlights</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="rounded-xl bg-blue-50 px-4 py-3">Real-time dashboards by role</li>
            <li className="rounded-xl bg-blue-50 px-4 py-3">Secure authentication and profiles</li>
            <li className="rounded-xl bg-blue-50 px-4 py-3">Scalable architecture for growth</li>
          </ul>
        </Card>
      </section>

      <section id="features" className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Core Features</h2>
          <p className="mt-2 text-slate-600">Everything needed to run a modern institution.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="contact" className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Need a custom setup?</h2>
        <p className="mt-2 text-slate-600">
          Contact our team to configure EduManage for your university workflows.
        </p>
      </section>
    </div>
  );
}
