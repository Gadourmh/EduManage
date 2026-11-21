"use client";

import { Button } from "@/components/ui/Button";
import type { Department } from "@/types/department";

interface ConfirmDialogProps {
  isOpen: boolean;
  department: Department | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmDialog({ isOpen, department, loading = false, onCancel, onConfirm }: ConfirmDialogProps) {
  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation"
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-[fadeIn_.18s_ease-out]">
        <h2 className="text-lg font-semibold text-slate-900">Delete Department</h2>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to delete <span className="font-medium text-slate-900">{department.name}</span>? This
          action cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={() => void onConfirm()} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
