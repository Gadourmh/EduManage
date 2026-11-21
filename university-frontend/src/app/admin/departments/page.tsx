"use client";

import { useEffect, useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/admin/departments/ConfirmDialog";
import { DepartmentModal } from "@/components/admin/departments/DepartmentModal";
import { DepartmentTable } from "@/components/admin/departments/DepartmentTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Department } from "@/types/department";
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

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [activeDepartment, setActiveDepartment] = useState<Department | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastType) => {
    const nextToast = { id: Date.now(), message, type };
    setToast(nextToast);
  };

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = globalThis.setTimeout(() => setToast(null), 3000);
    return () => globalThis.clearTimeout(timeout);
  }, [toast]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/departments");
      const departmentsData = Array.isArray(response.data?.departments)
        ? response.data.departments
        : [];
      const data = Array.isArray(response.data) ? response.data : departmentsData;
      setDepartments(data);
    } catch {
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return departments;

    return departments.filter((department) => department.name.toLowerCase().includes(query));
  }, [departments, searchTerm]);

  const openAddModal = () => {
    setModalMode("add");
    setActiveDepartment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setModalMode("edit");
    setActiveDepartment(department);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (name: string) => {
    try {
      setSubmitting(true);

      if (modalMode === "add") {
        const response = await api.post("/departments", { name });
        const createdDepartment: Department = response.data?.department ?? response.data;
        setDepartments((previous) => [createdDepartment, ...previous]);
        showToast("Department created successfully.", "success");
      } else if (activeDepartment) {
        const response = await api.put(`/departments/${activeDepartment.id}`, { name });
        const updatedDepartment: Department = response.data?.department ?? response.data;
        setDepartments((previous) =>
          previous.map((department) => (department.id === activeDepartment.id ? updatedDepartment : department))
        );
        showToast("Department updated successfully.", "success");
      }

      setIsModalOpen(false);
    } catch {
      showToast(modalMode === "add" ? "Failed to create department." : "Failed to update department.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (department: Department) => {
    setDepartmentToDelete(department);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;

    try {
      setSubmitting(true);
      await api.delete(`/departments/${departmentToDelete.id}`);
      setDepartments((previous) => previous.filter((department) => department.id !== departmentToDelete.id));
      showToast("Department deleted successfully.", "success");
      setIsDeleteOpen(false);
      setDepartmentToDelete(null);
    } catch {
      showToast("Failed to delete department.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments Management</h1>
          <p className="mt-1 text-sm text-slate-600">Manage academic departments across your institution.</p>
        </div>
        <Button onClick={openAddModal}>
          <span className="mr-1.5 inline-flex" aria-hidden>
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M10 3.25a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4a.75.75 0 0 1 .75-.75Z" />
            </svg>
          </span>
          {" "}
          Add Department
        </Button>
      </header>

      <Card className="space-y-4">
        <Input
          label="Search departments"
          placeholder="Search by department name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              {" "}
              Loading departments...
            </div>
          </div>
        ) : (
          <DepartmentTable departments={filteredDepartments} onEdit={openEditModal} onDelete={openDeleteDialog} />
        )}
      </Card>

      <DepartmentModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialDepartment={activeDepartment}
        loading={submitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        department={departmentToDelete}
        loading={submitting}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />

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
