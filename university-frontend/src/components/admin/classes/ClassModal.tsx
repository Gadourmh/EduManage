"use client";

import { FormEvent, useEffect, useState } from "react";

import type { Class as SchoolClass } from "@/types/class";
import type { Department } from "@/types/department";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/utils/cn";

interface ClassModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialClass?: SchoolClass | null;
  departments: Department[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; departmentId: number | string }) => Promise<void>;
}

export function ClassModal({
  isOpen,
  mode,
  initialClass,
  departments,
  loading = false,
  onClose,
  onSubmit,
}: ClassModalProps) {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState<number | string | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setName(initialClass?.name ?? "");
    setDepartmentId(initialClass?.departmentId ?? initialClass?.department?.id ?? "");
  }, [initialClass, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Class name is required.");
      return;
    }
    if (departmentId === "") {
      setError("Please select a department.");
      return;
    }

    setError("");
    try {
      await onSubmit({
  name: trimmedName,
  departmentId: Number(departmentId), // ✅ FIX ICI
});
      onClose();
    } catch {
      setError(mode === "add" ? "Failed to create class." : "Failed to update class.");
    }
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
          "animate-[fadeIn_.18s_ease-out]",
        )}
      >
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === "add" ? "Add Class" : "Edit Class"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {mode === "add" ? "Create a new class and assign a department." : "Update class information."}
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Class Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. 1st Year Computer Science"
            required
          />

          <Select
            label="Department"
            value={departmentId}
            onChange={(event) => setDepartmentId(event.target.value)}
          >
            <option value="" disabled>
              Select a department
            </option>
            {departments.map((d) => (
              <option key={String(d.id)} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>

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

