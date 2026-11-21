"use client";

import type { Department } from "@/types/department";
import type { Class as SchoolClass } from "@/types/class";
import type { Teacher } from "@/types/teacher";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";

interface ClassTableProps {
  classes: SchoolClass[];
  departments: Department[];
  teachers: Teacher[];
  onEdit: (classItem: SchoolClass) => void;
  onDelete: (classItem: SchoolClass) => void;
}

function idsEqual(a: number | string | undefined, b: number | string | undefined) {
  return a !== undefined && b !== undefined && String(a) === String(b);
}

function teacherDisplayName(teacher: Teacher) {
  return teacher.fullName ?? teacher.name ?? "Unknown teacher";
}

function resolveDepartmentName(classItem: SchoolClass, departments: Department[]) {
  if (classItem.department?.name) return classItem.department.name;
  if (classItem.departmentId === undefined) return "-";
  const found = departments.find((d) => idsEqual(d.id, classItem.departmentId));
  return found?.name ?? "-";
}

function resolveStudentsCount(classItem: SchoolClass) {
  const count =
    classItem.studentsCount ??
    classItem.numberOfStudents ??
    undefined;
  return typeof count === "number" ? count : typeof count === "string" ? Number(count) : "-";
}

function resolveAssignedTeachers(classItem: SchoolClass, teachers: Teacher[]) {
  if (Array.isArray(classItem.teachers) && classItem.teachers.length > 0) {
    return classItem.teachers;
  }

  if (Array.isArray(classItem.teacherIds) && classItem.teacherIds.length > 0) {
    return classItem.teacherIds
      .map((id) => teachers.find((t) => idsEqual(t.id, id)))
      .filter(Boolean) as Teacher[];
  }

  return [];
}

function joinTeacherNames(assignedTeachers: Teacher[]) {
  if (assignedTeachers.length === 0) return "-";
  const names = assignedTeachers.slice(0, 3).map(teacherDisplayName);
  const remaining = assignedTeachers.length - names.length;
  return remaining > 0 ? `${names.join(", ")} +${remaining} more` : names.join(", ");
}

export function ClassTable({ classes, departments, teachers, onEdit, onDelete }: ClassTableProps) {
  return (
    <Table headers={["Class Name", "Department", "Number of Students", "Assigned Teachers", "Actions"]}>
      {classes.map((classItem) => {
        const assignedTeachers = resolveAssignedTeachers(classItem, teachers);
        return (
          <tr key={String(classItem.id)} className="transition-colors hover:bg-slate-50/80">
            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">{classItem.name}</td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
              {resolveDepartmentName(classItem, departments)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
              {resolveStudentsCount(classItem)}
            </td>
            <td className="px-4 py-3 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-slate-800">{joinTeacherNames(assignedTeachers)}</p>
                <p className="text-xs text-slate-500">{assignedTeachers.length > 0 ? `${assignedTeachers.length} teacher(s)` : ""}</p>
              </div>
            </td>
            <td className="px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => onEdit(classItem)}>
                  <span className="mr-1.5 inline-flex" aria-hidden>
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                      <path d="M13.586 2.586a2 2 0 0 1 2.828 2.828l-8.06 8.061a2 2 0 0 1-.878.497l-3.111.889a.75.75 0 0 1-.927-.927l.889-3.11a2 2 0 0 1 .497-.879l8.06-8.06ZM12.525 4.707 5.947 11.285a.5.5 0 0 0-.124.22l-.56 1.96 1.96-.56a.5.5 0 0 0 .22-.124l6.578-6.578-1.496-1.496Z" />
                    </svg>
                  </span>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(classItem)}>
                  <span className="mr-1.5 inline-flex" aria-hidden>
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                      <path d="M7.5 2.75A1.75 1.75 0 0 0 5.75 4.5v.25H3a.75.75 0 0 0 0 1.5h.5v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9H17a.75.75 0 0 0 0-1.5h-2.75V4.5A1.75 1.75 0 0 0 12.5 2.75h-5Zm5.25 2h-5.5V4.5a.25.25 0 0 1 .25-.25h5a.25.25 0 0 1 .25.25v.25Zm-4 3a.75.75 0 0 0-1.5 0v6a.75.75 0 1 0 1.5 0v-6Zm4 0a.75.75 0 0 0-1.5 0v6a.75.75 0 1 0 1.5 0v-6Z" />
                    </svg>
                  </span>
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        );
      })}
    </Table>
  );
}

