"use client";

import { useEffect, useMemo, useState } from "react";

import { ClassModal } from "@/components/admin/classes/ClassModal";
import { ClassTable } from "@/components/admin/classes/ClassTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Class as SchoolClass } from "@/types/class";
import type { Department } from "@/types/department";
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

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [activeClass, setActiveClass] = useState<SchoolClass | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);

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

        const [departmentsRes, teachersRes, classesRes] = await Promise.all([
          api.get("/departments"),
          api.get("/teachers-courses"),
          api.get("/classes"),
        ]);

        const nextDepartments: Department[] = Array.isArray(departmentsRes.data?.departments)
          ? departmentsRes.data.departments
          : Array.isArray(departmentsRes.data)
            ? departmentsRes.data
            : [];

        const nextTeachers: Teacher[] = Array.isArray(teachersRes.data?.teachers)
          ? teachersRes.data.teachers
          : Array.isArray(teachersRes.data)
            ? teachersRes.data
            : [];

        const nextClasses: SchoolClass[] = Array.isArray(classesRes.data?.classes)
          ? classesRes.data.classes
          : Array.isArray(classesRes.data)
            ? classesRes.data
            : [];

        setDepartments(nextDepartments);
        setTeachers(nextTeachers);
        setClasses(nextClasses);
      } catch {
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };

    void fetchAll();
  }, []);

  const departmentName = (classItem: SchoolClass) => {
    if (classItem.department?.name) return classItem.department.name;
    if (classItem.departmentId === undefined) return "-";
    const found = departments.find((d) => String(d.id) === String(classItem.departmentId));
    return found?.name ?? "-";
  };

  const filteredClasses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return classes;

    return classes.filter((c) => {
      const dept = departmentName(c).toLowerCase();
      return c.name.toLowerCase().includes(query) || dept.includes(query);
    });
  }, [classes, departmentName, searchTerm]);

  const openAddModal = () => {
    setModalMode("add");
    setActiveClass(null);
    setIsModalOpen(true);
  };

  const openEditModal = (classItem: SchoolClass) => {
    setModalMode("edit");
    setActiveClass(classItem);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (payload: { name: string; departmentId: number | string }) => {
    try {
      setSubmitting(true);

      if (modalMode === "add") {
        const res = await api.post("/classes", payload);
        const raw = res.data?.class ?? res.data?.classes ?? res.data;
        const created: SchoolClass =
          raw && Array.isArray(raw) ? raw[0] : (raw as SchoolClass);

        setClasses((previous) => [created, ...previous]);
        showToast("Class created successfully.", "success");
      } else if (activeClass) {
        const res = await api.put(`/classes/${activeClass.id}`, payload);
        const raw = res.data?.class ?? res.data?.classes ?? res.data;
        const updated: SchoolClass =
          raw && Array.isArray(raw) ? raw[0] : (raw as SchoolClass);

        setClasses((previous) =>
          previous.map((c) => (String(c.id) === String(activeClass.id) ? updated : c))
        );
        showToast("Class updated successfully.", "success");
      }

      setIsModalOpen(false);
    } catch {
      showToast(modalMode === "add" ? "Failed to create class." : "Failed to update class.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (classItem: SchoolClass) => {
    setClassToDelete(classItem);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!classToDelete) return;

    try {
      setSubmitting(true);
      await api.delete(`/classes/${classToDelete.id}`);
      setClasses((previous) => previous.filter((c) => String(c.id) !== String(classToDelete.id)));
      showToast("Class deleted successfully.", "success");
      setIsDeleteOpen(false);
      setClassToDelete(null);
    } catch {
      showToast("Failed to delete class.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes Management</h1>
          <p className="mt-1 text-sm text-slate-600">Manage university classes, departments, and teacher assignments.</p>
        </div>
        <Button onClick={openAddModal}>
          <span className="mr-1.5 inline-flex" aria-hidden>
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M10 3.25a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4a.75.75 0 0 1 .75-.75Z" />
            </svg>
          </span>{" "}
          Add Class
        </Button>
      </header>

      <Card className="space-y-4">
        <Input
          label="Search classes"
          placeholder="Search by class name or department..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />{" "}
              Loading classes...
            </div>
          </div>
        ) : (
          <ClassTable
            classes={filteredClasses}
            departments={departments}
            teachers={teachers}
            onEdit={openEditModal}
            onDelete={openDeleteDialog}
          />
        )}
      </Card>

      <ClassModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialClass={activeClass}
        departments={departments}
        loading={submitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      {isDeleteOpen && classToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close confirmation"
            onClick={() => setIsDeleteOpen(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-[fadeIn_.18s_ease-out]">
            <h2 className="text-lg font-semibold text-slate-900">Delete Class</h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">{classToDelete.name}</span>? This action cannot be undone.
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

