import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";

const assignedCourses = [
  { id: 1, name: "Algorithms", students: 42, semester: "Spring 2026" },
  { id: 2, name: "Database Systems", students: 36, semester: "Spring 2026" },
  { id: 3, name: "Software Engineering", students: 51, semester: "Spring 2026" },
];

const examRows = [
  { exam: "Midterm - Algorithms", status: "Pending grading", dueDate: "May 18, 2026" },
  { exam: "Quiz - Database", status: "Published", dueDate: "Apr 22, 2026" },
];

export default function TeacherDashboardPage() {
  return (
    <div className="w-full space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="mt-1 text-slate-600">Manage your courses, exams, and grade submissions.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {assignedCourses.map((course) => (
          <Card key={course.id}>
            <h2 className="text-lg font-semibold text-slate-900">{course.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{course.students} students enrolled</p>
            <p className="text-sm text-slate-500">{course.semester}</p>
          </Card>
        ))}
      </section>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Exams & Grades</h2>
          <Button size="sm">Create Exam</Button>
        </div>
        <Table headers={["Exam", "Status", "Due Date"]}>
          {examRows.map((row) => (
            <tr key={row.exam}>
              <td className="px-4 py-3 text-sm text-slate-700">{row.exam}</td>
              <td className="px-4 py-3 text-sm text-blue-700">{row.status}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{row.dueDate}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
