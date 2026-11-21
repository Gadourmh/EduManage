"use client";

import { useEffect, useMemo, useState } from "react";

import { StudentModal } from "@/components/admin/students/StudentModal";
import { StudentTable } from "@/components/admin/students/StudentTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import api from "@/utils/api";

type ToastType = "success" | "error";

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

interface Department {
  id: number | string;
  name: string;
}

interface ClassItem {
  id: number | string;
  name: string;
  departmentId?: number | string;
  department?: Department | null;
}

interface StudentItem {
  id: number | string;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  className?: string | null;
  departmentName?: string | null;
  class?: {
    id?: number | string;
    name?: string | null;
    department?: Department | null;
  } | null;
  department?: Department | null;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

function resolveClassName(classItem: ClassItem) {
  return classItem.name;
}

function resolveDepartmentName(classItem: ClassItem) {
  return classItem.department?.name ?? "-";
}

function studentDisplayName(student: StudentItem) {
  return student.fullName ?? student.name ?? "Unknown Student";
}

export default function StudentsManagementPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [allStudents, setAllStudents] = useState<StudentItem[]>([]);
  const [classStudents, setClassStudents] = useState<StudentItem[]>([]);
  const [globallyAssignedStudentIds, setGloballyAssignedStudentIds] = useState<Set<string>>(new Set());

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<StudentItem | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = globalThis.setTimeout(() => setToast(null), 2800);
    return () => globalThis.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingInitial(true);
        setError("");

        const [classesRes, studentsRes] = await Promise.all([
          api.get("/classes"),
          api.get("/users?role=student"),
        ]);

        let fetchedClasses: ClassItem[];
        if (Array.isArray(classesRes.data?.classes)) {
          fetchedClasses = classesRes.data.classes;
        } else if (Array.isArray(classesRes.data)) {
          fetchedClasses = classesRes.data;
        } else {
          fetchedClasses = [];
        }

        let fetchedStudents: StudentItem[];
        if (Array.isArray(studentsRes.data?.users)) {
          fetchedStudents = studentsRes.data.users;
        } else if (Array.isArray(studentsRes.data?.students)) {
          fetchedStudents = studentsRes.data.students;
        } else if (Array.isArray(studentsRes.data)) {
          fetchedStudents = studentsRes.data;
        } else {
          fetchedStudents = [];
        }

        setClasses(fetchedClasses);
        const normalizedStudents = fetchedStudents.filter(
          (user) => !user.role || String(user.role).toLowerCase() === "student",
        );
        setAllStudents(normalizedStudents);

        const assignedIds = new Set<string>();
        await Promise.all(
          fetchedClasses.map(async (classItem) => {
            try {
              const response = await api.get(`/student-classes/${Number(classItem.id)}/students`);
              const studentsInClass: StudentItem[] = Array.isArray(response.data?.students)
                ? response.data.students
                : Array.isArray(response.data)
                  ? response.data
                  : [];
              studentsInClass.forEach((student) => assignedIds.add(String(student.id)));
            } catch {
              // A 404 means the class currently has no students, so we ignore it.
            }
          }),
        );
        setGloballyAssignedStudentIds(assignedIds);

        if (fetchedClasses.length > 0) {
          setSelectedClassId(String(fetchedClasses[0].id));
        }
      } catch {
        setError("Failed to load classes and students.");
      } finally {
        setLoadingInitial(false);
      }
    };

    void fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchClassStudents = async () => {
      if (!selectedClassId) {
        setClassStudents([]);
        return;
      }

      try {
        setLoadingStudents(true);
        setError("");

        const response = await api.get(`/student-classes/${Number(selectedClassId)}/students`);

        const fallbackStudents = Array.isArray(response.data) ? response.data : [];
        const fetchedStudents: StudentItem[] = Array.isArray(response.data?.students)
          ? response.data.students
          : fallbackStudents;

        setClassStudents(fetchedStudents);
      } catch {
        setClassStudents([]);
        setError("Failed to load students for this class.");
      } finally {
        setLoadingStudents(false);
      }
    };

    void fetchClassStudents();
  }, [selectedClassId]);

  const selectedClass = useMemo(
    () => classes.find((c) => String(c.id) === selectedClassId) ?? null,
    [classes, selectedClassId],
  );

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return classStudents;

    return classStudents.filter((student) => {
      const name = studentDisplayName(student).toLowerCase();
      const email = (student.email ?? "").toLowerCase();
      const className = (student.className ?? student.class?.name ?? selectedClass?.name ?? "").toLowerCase();
      const department = (
        student.departmentName ??
        student.class?.department?.name ??
        selectedClass?.department?.name ??
        ""
      ).toLowerCase();

      return (
        name.includes(query) || email.includes(query) || className.includes(query) || department.includes(query)
      );
    });
  }, [classStudents, searchTerm, selectedClass]);

  const assignableStudents = useMemo(() => {
    return allStudents.filter((student) => !globallyAssignedStudentIds.has(String(student.id)));
  }, [allStudents, globallyAssignedStudentIds]);

  const openRemoveDialog = (student: unknown) => {
    setStudentToRemove(student as StudentItem);
    setIsRemoveOpen(true);
  };

  const studentListContent = (() => {
    if (loadingInitial || loadingStudents) {
      return (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />{" "}
            Loading students...
          </div>
        </div>
      );
    }

    if (filteredStudents.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            {selectedClass
              ? "No students are assigned to this class yet."
              : "Select a class to view assigned students."}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Use <span className="font-medium">Assign Student</span> to enroll students.
          </p>
        </div>
      );
    }

    return <StudentTable students={filteredStudents} onRemove={openRemoveDialog} />;
  })();

  const handleAssignStudent = async (payload: { studentId: number; classId: number }) => {
    try {
      setSubmitting(true);
      await api.post("/student-classes/assign", {
        studentId: Number(payload.studentId),
        classId: Number(payload.classId),
      });

      const student = allStudents.find((item) => Number(item.id) === Number(payload.studentId));
      if (student) {
        setClassStudents((previous) => [
          {
            ...student,
            className: selectedClass?.name ?? student.className ?? "-",
            departmentName: selectedClass?.department?.name ?? student.departmentName ?? "-",
          },
          ...previous,
        ]);
        setGloballyAssignedStudentIds((previous) => {
          const next = new Set(previous);
          next.add(String(student.id));
          return next;
        });
      } else {
        const response = await api.get(`/student-classes/${Number(payload.classId)}/students`);
        let refreshedStudents: StudentItem[];
        if (Array.isArray(response.data?.students)) {
          refreshedStudents = response.data.students;
        } else if (Array.isArray(response.data)) {
          refreshedStudents = response.data;
        } else {
          refreshedStudents = [];
        }
        setClassStudents(refreshedStudents);
      }

      showToast("Student assigned successfully.", "success");
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      const message =
        apiError.response?.data?.error ??
        apiError.response?.data?.message ??
        "Failed to assign student.";
      showToast(message, "error");
      throw new Error("Assign failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove || !selectedClass) return;

    try {
      setSubmitting(true);
      await api.delete("/student-classes/remove", {
        data: {
          studentId: Number(studentToRemove.id),
          classId: Number(selectedClass.id),
        },
      });

      setClassStudents((previous) =>
        previous.filter((student) => Number(student.id) !== Number(studentToRemove.id)),
      );
      setGloballyAssignedStudentIds((previous) => {
        const next = new Set(previous);
        next.delete(String(studentToRemove.id));
        return next;
      });
      setIsRemoveOpen(false);
      setStudentToRemove(null);
      showToast("Student removed from class.", "success");
    } catch {
      showToast("Failed to remove student.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">EduManage - Student Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Assign students to classes and manage enrollments across departments.
          </p>
        </div>
        <Button onClick={() => setIsAssignOpen(true)} disabled={!selectedClass || submitting}>
          <span className="mr-1.5 inline-flex" aria-hidden>
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M10 3.25a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4a.75.75 0 0 1 .75-.75Z" />
            </svg>
          </span> Assign Student
        </Button>
      </header>

      <Card className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Select Class"
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(String(Number(event.target.value)))}
            disabled={loadingInitial || classes.length === 0}
          >
            {classes.length === 0 ? (
              <option value="">No classes available</option>
            ) : (
              classes.map((classItem) => (
                <option key={String(classItem.id)} value={String(Number(classItem.id))}>
                  {resolveClassName(classItem)} - {resolveDepartmentName(classItem)}
                </option>
              ))
            )}
          </Select>

          <Input
            label="Search Students"
            placeholder="Search by name, email, class, or department..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        {studentListContent}
      </Card>

      <StudentModal
        isOpen={isAssignOpen}
        selectedClass={selectedClass}
        students={assignableStudents}
        loading={submitting}
        onClose={() => setIsAssignOpen(false)}
        onSubmit={handleAssignStudent}
      />

      <ConfirmDialog
        isOpen={isRemoveOpen && Boolean(studentToRemove)}
        title="Remove Student"
        message={`Are you sure you want to remove ${
          studentToRemove ? studentDisplayName(studentToRemove) : "this student"
        } from ${selectedClass?.name ?? "this class"}?`}
        confirmText="Remove"
        loading={submitting}
        onCancel={() => {
          setIsRemoveOpen(false);
          setStudentToRemove(null);
        }}
        onConfirm={() => void handleRemoveStudent()}
      />

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[60]">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
            key={toast.id}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
    </main>
  );
}
