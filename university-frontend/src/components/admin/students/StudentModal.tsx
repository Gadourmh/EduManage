"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/utils/cn";

interface StudentOption {
  id: number | string;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
}

interface ClassOption {
  id: number | string;
  name: string;
}

interface StudentModalProps {
  isOpen: boolean;
  selectedClass: ClassOption | null;
  students: StudentOption[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { studentId: number; classId: number }) => Promise<void>;
}

function studentDisplayName(student: StudentOption) {
  const baseName = student.fullName ?? student.name ?? "Unknown Student";
  return student.email ? `${baseName} (${student.email})` : baseName;
}

export function StudentModal({
  isOpen,
  selectedClass,
  students,
  loading = false,
  onClose,
  onSubmit,
}: StudentModalProps) {
  const [studentId, setStudentId] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setStudentId("");
    setError("");
  }, [isOpen]);

  const sortedStudents = useMemo(
    () =>
      [...students].sort((a, b) =>
        studentDisplayName(a).toLowerCase().localeCompare(studentDisplayName(b).toLowerCase()),
      ),
    [students],
  );

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedClass) {
      setError("Please select a class first.");
      return;
    }
    if (!studentId) {
      setError("Please choose a student.");
      return;
    }

    setError("");
    try {
      await onSubmit({ studentId: Number(studentId), classId: Number(selectedClass.id) });
      onClose();
    } catch {
      setError("Failed to assign student.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close assign student modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl",
          "animate-[fadeIn_.18s_ease-out]",
        )}
      >
        <h2 className="text-xl font-semibold text-slate-900">Assign Student</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add a student to{" "}
          <span className="font-medium text-slate-900">{selectedClass?.name ?? "selected class"}</span>.
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Select label="Class" value={selectedClass?.id ? String(selectedClass.id) : ""} disabled>
            <option value={selectedClass?.id ? String(selectedClass.id) : ""}>
              {selectedClass?.name ?? "No class selected"}
            </option>
          </Select>

          <Select label="Student" value={studentId} onChange={(event) => setStudentId(event.target.value)}>
            <option value="" disabled>
              Select a student
            </option>
            {sortedStudents.map((student) => (
              <option key={String(student.id)} value={String(student.id)}>
                {studentDisplayName(student)}
              </option>
            ))}
          </Select>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedClass}>
              {loading ? "Assigning..." : "Assign Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
