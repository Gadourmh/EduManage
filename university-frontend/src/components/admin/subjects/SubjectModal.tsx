"use client";

import { FormEvent, useEffect, useState } from "react";

import type { Class as SchoolClass } from "@/types/class";
import type { Course } from "@/types/course";
import type { Teacher } from "@/types/teacher";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/utils/cn";

interface SubjectModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialCourse?: Course | null;
  classes: SchoolClass[];
  teachers: Teacher[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; classId: number | string; teacherId: number | string }) => Promise<void>;
}

export function SubjectModal({
  isOpen,
  mode,
  initialCourse,
  classes,
  teachers,
  loading = false,
  onClose,
  onSubmit,
}: SubjectModalProps) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState<number | string | "">("");
  const [teacherId, setTeacherId] = useState<number | string | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setName(initialCourse?.name ?? "");
    setClassId(initialCourse?.classId ?? initialCourse?.class?.id ?? "");
    setTeacherId(initialCourse?.teacherId ?? initialCourse?.teacher?.id ?? "");
  }, [initialCourse, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Course name is required.");
      return;
    }
    if (classId === "") {
      setError("Please select a class.");
      return;
    }
    if (teacherId === "") {
      setError("Please select a teacher.");
      return;
    }

    setError("");
    try {
      await onSubmit({ name: trimmedName, classId, teacherId });
      onClose();
    } catch {
      setError(mode === "add" ? "Failed to create course." : "Failed to update course.");
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
        <h2 className="text-xl font-semibold text-slate-900">{mode === "add" ? "Add Course" : "Edit Course"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {mode === "add" ? "Create a new course and assign a teacher." : "Update course details."}
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Course Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Mathematics"
            required
          />

          <Select label="Class" value={classId} onChange={(event) => setClassId(event.target.value)}>
            <option value="" disabled>
              Select a class
            </option>
            {classes.map((c) => (
              <option key={String(c.id)} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select label="Teacher" value={teacherId} onChange={(event) => setTeacherId(event.target.value)}>
            <option value="" disabled>
              Select a teacher
            </option>
            {teachers.map((t) => (
              <option key={String(t.id)} value={t.id}>
                {t.fullName ?? t.name ?? "Unknown teacher"}
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

