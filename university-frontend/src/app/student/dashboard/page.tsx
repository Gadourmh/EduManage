import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

const courses = [
  { code: "CS301", title: "Algorithms", credits: 4 },
  { code: "CS302", title: "Database Systems", credits: 3 },
  { code: "CS303", title: "Operating Systems", credits: 3 },
];

const grades = [
  { course: "Algorithms", score: 16.5, status: "Excellent" },
  { course: "Database Systems", score: 14.2, status: "Good" },
  { course: "Operating Systems", score: 13.8, status: "Good" },
];

const averageScore =
  grades.reduce((sum, item) => sum + item.score, 0) / Math.max(1, grades.length);

export default function StudentDashboardPage() {
  return (
    <div className="w-full space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
        <p className="mt-1 text-slate-600">Track your courses, grades, and academic performance.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Current Courses</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {courses.map((course) => (
              <div key={course.code} className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">{course.title}</p>
                <p className="text-xs text-blue-700">
                  {course.code} - {course.credits} credits
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Average Score</p>
          <p className="mt-2 text-4xl font-bold text-blue-700">{averageScore.toFixed(1)}/20</p>
          <p className="mt-2 text-sm text-slate-600">Keep up the progress this semester.</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Grades Overview</h2>
        <Table headers={["Course", "Score", "Status"]}>
          {grades.map((grade) => (
            <tr key={grade.course}>
              <td className="px-4 py-3 text-sm text-slate-700">{grade.course}</td>
              <td className="px-4 py-3 text-sm font-semibold text-slate-900">{grade.score}/20</td>
              <td className="px-4 py-3 text-sm text-blue-700">{grade.status}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
