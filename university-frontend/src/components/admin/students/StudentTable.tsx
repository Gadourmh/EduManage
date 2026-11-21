"use client";

import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";

interface StudentClassItem {
  id: number | string;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  className?: string | null;
  departmentName?: string | null;
  class?: { id?: number | string; name?: string | null; department?: { name?: string | null } | null } | null;
  department?: { name?: string | null } | null;
}

interface StudentTableProps {
  students: StudentClassItem[];
  onRemove: (student: StudentClassItem) => void;
}

function resolveName(student: StudentClassItem) {
  return student.fullName ?? student.name ?? "Unknown Student";
}

function resolveClass(student: StudentClassItem) {
  return student.className ?? student.class?.name ?? "-";
}

function resolveDepartment(student: StudentClassItem) {
  return student.departmentName ?? student.class?.department?.name ?? student.department?.name ?? "-";
}

export function StudentTable({ students, onRemove }: StudentTableProps) {
  return (
    <Table headers={["Full Name", "Email", "Class Name", "Department", "Actions"]}>
      {students.map((student) => (
        <tr key={String(student.id)} className="transition-colors hover:bg-slate-50/80">
          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">{resolveName(student)}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{student.email ?? "-"}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{resolveClass(student)}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{resolveDepartment(student)}</td>
          <td className="px-4 py-3 text-sm">
            <Button size="sm" variant="danger" onClick={() => onRemove(student)}>
              <span className="mr-1.5 inline-flex" aria-hidden>
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                  <path d="M7.5 2.75A1.75 1.75 0 0 0 5.75 4.5v.25H3a.75.75 0 0 0 0 1.5h.5v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9H17a.75.75 0 0 0 0-1.5h-2.75V4.5A1.75 1.75 0 0 0 12.5 2.75h-5Zm5.25 2h-5.5V4.5a.25.25 0 0 1 .25-.25h5a.25.25 0 0 1 .25.25v.25Zm-4 3a.75.75 0 0 0-1.5 0v6a.75.75 0 1 0 1.5 0v-6Zm4 0a.75.75 0 0 0-1.5 0v6a.75.75 0 1 0 1.5 0v-6Z" />
                </svg>
              </span>
              Remove
            </Button>
          </td>
        </tr>
      ))}
    </Table>
  );
}
