"use client";

import { useEffect, useMemo, useState } from "react";

import { CourseTable } from "@/components/admin/subjects/CourseTable";
import { SubjectModal } from "@/components/admin/subjects/SubjectModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Class as SchoolClass } from "@/types/class";
import type { Course } from "@/types/course";
import type { Teacher } from "@/types/teacher";
import api from "@/utils/api";

type ToastType = "success" | "error";

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

function LoadingSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
      aria-hidden
    />
  );
}

export default function SubjectsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [updatingCourseId, setUpdatingCourseId] = useState<number | string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = globalThis.setTimeout(() => setToast(null), 3000);
    return () => globalThis.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [classesRes, teachersRes, coursesRes] = await Promise.all([
          api.get("/classes"),
          api.get("/teachers-courses"),
          api.get("/courses"),
        ]);

        const nextClasses: SchoolClass[] = Array.isArray(classesRes.data?.classes)
          ? classesRes.data.classes
          : Array.isArray(classesRes.data)
            ? classesRes.data
            : [];


        const nextTeachers: Teacher[] = Array.isArray(teachersRes.data?.teachers)
          ? teachersRes.data.teachers
          : Array.isArray(teachersRes.data)
            ? teachersRes.data
            : [];

        const nextCourses: Course[] = Array.isArray(coursesRes.data?.courses)
          ? coursesRes.data.courses
          : Array.isArray(coursesRes.data)
            ? coursesRes.data
            : [];

        setClasses(nextClasses);
        setTeachers(nextTeachers);
        setCourses(nextCourses);
      } catch {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    void fetchAll();
  }, []);

  const resolveClassName = (course: Course) => {
    if (course.class?.name) return course.class.name;
    if (course.classId === undefined) return "-";
    const found = classes.find((c) => String(c.id) === String(course.classId));
    return found?.name ?? "-";
  };

  const resolveTeacherName = (course: Course) => {
    const direct = course.teacher?.fullName ?? course.teacher?.name;
    if (direct) return direct;

    const id = course.teacherId;
    if (id === undefined) return "-";
    const found = teachers.find((t) => String(t.id) === String(id));
    return found?.fullName ?? found?.name ?? "-";
  };

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return courses;

    return courses.filter((course) => {
      const name = course.name.toLowerCase();
      const className = resolveClassName(course).toLowerCase();
      const teacherName = resolveTeacherName(course).toLowerCase();
      return name.includes(query) || className.includes(query) || teacherName.includes(query);
    });
  }, [courses, resolveClassName, resolveTeacherName, searchTerm]);

  const openAddModal = () => {
    setModalMode("add");
    setActiveCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setModalMode("edit");
    setActiveCourse(course);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (payload: {
    name: string;
    classId: number | string;
    teacherId: number | string;
  }) => {
    try {
      setSubmitting(true);

      if (modalMode === "add") {
        const res = await api.post("/courses", payload);
        const raw = res.data?.course ?? res.data?.courses ?? res.data;
        const created: Course =
          raw && Array.isArray(raw) ? raw[0] : (raw as Course);

        setCourses((previous) => [created, ...previous]);
        showToast("Course created successfully.", "success");
      } else if (activeCourse) {
        const res = await api.put(`/courses/${activeCourse.id}`, payload);
        const raw = res.data?.course ?? res.data?.courses ?? res.data;
        const updated: Course =
          raw && Array.isArray(raw) ? raw[0] : (raw as Course);

        setCourses((previous) =>
          previous.map((c) => (String(c.id) === String(activeCourse.id) ? updated : c))
        );
        showToast("Course updated successfully.", "success");
      }

      setIsModalOpen(false);
    } catch {
      showToast(modalMode === "add" ? "Failed to create course." : "Failed to update course.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTeacher = async (courseId: number | string, teacherId: number | string) => {
    try {
      setUpdatingCourseId(courseId);

      const res = await api.put(`/courses/${courseId}`, { teacherId });
      const raw = res.data?.course ?? res.data?.courses ?? res.data;
      const updated: Course =
        raw && Array.isArray(raw) ? raw[0] : (raw as Course);

      setCourses((previous) => previous.map((c) => (String(c.id) === String(courseId) ? updated : c)));
      showToast("Teacher assigned successfully.", "success");
    } catch {
      showToast("Failed to assign teacher.", "error");
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const openDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;

    try {
      setSubmitting(true);
      await api.delete(`/courses/${courseToDelete.id}`);
      setCourses((previous) => previous.filter((c) => String(c.id) !== String(courseToDelete.id)));
      showToast("Course deleted successfully.", "success");
      setIsDeleteOpen(false);
      setCourseToDelete(null);
    } catch {
      showToast("Failed to delete course.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Courses Management</h1>
          <p className="mt-1 text-sm text-slate-600">Create courses, assign classes, and manage teacher assignments.</p>
        </div>
        <Button onClick={openAddModal}>
          <span className="mr-1.5 inline-flex" aria-hidden>
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M10 3.25a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4a.75.75 0 0 1 .75-.75Z" />
            </svg>
          </span>{" "}
          Add Course
        </Button>
      </header>

      <Card className="space-y-4">
        <Input
          label="Search courses"
          placeholder="Search by course, class, or teacher..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />{" "}
              Loading courses...
            </div>
          </div>
        ) : (
          <CourseTable
            courses={filteredCourses}
            classes={classes}
            teachers={teachers}
            updatingCourseId={updatingCourseId}
            onAssignTeacher={handleAssignTeacher}
            onEdit={openEditModal}
            onDelete={openDeleteDialog}
          />
        )}
      </Card>

      <SubjectModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialCourse={activeCourse}
        classes={classes}
        teachers={teachers}
        loading={submitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      {isDeleteOpen && courseToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close confirmation"
            onClick={() => setIsDeleteOpen(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-[fadeIn_.18s_ease-out]">
            <h2 className="text-lg font-semibold text-slate-900">Delete Course</h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">{courseToDelete.name}</span>? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="button" variant="danger" onClick={() => void handleDelete()} disabled={submitting}>
                {submitting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[60]">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
            key={toast.id}
          >
            <div className="flex items-center gap-2">
              {submitting ? <LoadingSpinner /> : null}
              <span>{toast.message}</span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

