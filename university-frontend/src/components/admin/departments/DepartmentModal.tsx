"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Department } from "@/types/department";
import { cn } from "@/utils/cn";

interface DepartmentModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialDepartment?: Department | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function DepartmentModal({
  isOpen,
  mode,
  initialDepartment,
  loading = false,
  onClose,
  onSubmit,
}: DepartmentModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialDepartment?.name ?? "");
      setError("");
    }
  }, [initialDepartment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Department name is required.");
      return;
    }

    setError("");
    await onSubmit(trimmedName);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl",
          "animate-[fadeIn_.18s_ease-out]"
        )}
      >
        <h2 className="text-xl font-semibold text-slate-900">{mode === "add" ? "Add Department" : "Edit Department"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {mode === "add" ? "Create a new department." : "Update department information."}
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Department Name"
            name="departmentName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Computer Science"
            required
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "add" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
