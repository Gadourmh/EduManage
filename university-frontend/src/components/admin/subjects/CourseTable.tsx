"use client";

import type { Class as SchoolClass } from "@/types/class";
import type { Course } from "@/types/course";
import type { Teacher } from "@/types/teacher";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";

interface CourseTableProps {
  courses: Course[];
  classes: SchoolClass[];
  teachers: Teacher[];
  updatingCourseId?: number | string | null;
  onAssignTeacher: (courseId: number | string, teacherId: number | string) => Promise<void> | void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

function idsEqual(a: number | string | undefined, b: number | string | undefined) {
  return a !== undefined && b !== undefined && String(a) === String(b);
}

function teacherDisplayName(teacher: Teacher) {
  return teacher.fullName ?? teacher.name ?? "Unknown teacher";
}

function classDisplayName(classItem: SchoolClass | undefined | null, fallbackId?: number | string) {
  if (classItem?.name) return classItem.name;
  if (fallbackId === undefined) return "-";
  return `Class ${fallbackId}`;
}

function LoadingSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
      aria-hidden
    />
  );
}

export function CourseTable({
  courses,
  classes,
  teachers,
  updatingCourseId = null,
  onAssignTeacher,
  onEdit,
  onDelete,
}: CourseTableProps) {
  return (
    <Table headers={["Course Name", "Class", "Teacher", "Actions"]}>
      {courses.map((course) => {
        const isUpdating = updatingCourseId !== null && idsEqual(course.id, updatingCourseId);
        const selectedTeacherIdRaw = course.teacherId ?? course.teacher?.id ?? "";
        const selectedTeacherId = selectedTeacherIdRaw === "" ? "" : String(selectedTeacherIdRaw);

        const resolvedClass =
          course.class ?? classes.find((c) => idsEqual(c.id, course.classId));
        const resolvedTeacher =
          course.teacher ?? teachers.find((t) => idsEqual(t.id, course.teacherId ?? course.teacher?.id));

        return (
          <tr key={String(course.id)} className="transition-colors hover:bg-slate-50/80">
            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">{course.name}</td>

            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
              {classDisplayName(resolvedClass, course.classId)}
            </td>

            <td className="px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <select
                    value={selectedTeacherId}
                    disabled={isUpdating}
                    onChange={(event) => {
                      const nextTeacherId = event.target.value;
                      if (nextTeacherId === "" || nextTeacherId === selectedTeacherId) return;
                      void onAssignTeacher(course.id, nextTeacherId);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <option value="" disabled>
                      {resolvedTeacher ? teacherDisplayName(resolvedTeacher) : "Select a teacher"}
                    </option>
                    {teachers.map((teacher) => (
                      <option key={String(teacher.id)} value={String(teacher.id)}>
                        {teacherDisplayName(teacher)}
                      </option>
                    ))}
                  </select>
                </div>
                {isUpdating ? <LoadingSpinner /> : null}
              </div>
            </td>

            <td className="px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => onEdit(course)}>
                  <span className="mr-1.5 inline-flex" aria-hidden>
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                      <path d="M13.586 2.586a2 2 0 0 1 2.828 2.828l-8.06 8.061a2 2 0 0 1-.878.497l-3.111.889a.75.75 0 0 1-.927-.927l.889-3.11a2 2 0 0 1 .497-.879l8.06-8.06ZM12.525 4.707 5.947 11.285a.5.5 0 0 0-.124.22l-.56 1.96 1.96-.56a.5.5 0 0 0 .22-.124l6.578-6.578-1.496-1.496Z" />
                    </svg>
                  </span>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(course)}>
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

