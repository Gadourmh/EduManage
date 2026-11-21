"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation dialog"
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl",
          "animate-[fadeIn_.18s_ease-out]",
        )}
      >
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Please wait..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
