import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import type { Department } from "@/types/department";

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  if (departments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm text-slate-600">No departments found.</p>
      </div>
    );
  }

  return (
    <Table headers={["Name", "Created Date", "Actions"]}>
      {departments.map((department) => (
        <tr key={department.id} className="transition-colors hover:bg-slate-50/80">
          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">{department.name}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">{formatDate(department.createdAt)}</td>
          <td className="px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => onEdit(department)}>
                <span className="mr-1.5 inline-flex" aria-hidden>
                  <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                    <path d="M13.586 2.586a2 2 0 0 1 2.828 2.828l-8.06 8.061a2 2 0 0 1-.878.497l-3.111.889a.75.75 0 0 1-.927-.927l.889-3.11a2 2 0 0 1 .497-.879l8.06-8.06ZM12.525 4.707 5.947 11.285a.5.5 0 0 0-.124.22l-.56 1.96 1.96-.56a.5.5 0 0 0 .22-.124l6.578-6.578-1.496-1.496Z" />
                  </svg>
                </span>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(department)}>
                <span className="mr-1.5 inline-flex" aria-hidden>
                  <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                    <path d="M7.5 2.75A1.75 1.75 0 0 0 5.75 4.5v.25H3a.75.75 0 0 0 0 1.5h.5v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9H17a.75.75 0 0 0 0-1.5h-2.75V4.5A1.75 1.75 0 0 0 12.5 2.75h-5Zm5.25 2h-5.5V4.5a.25.25 0 0 1 .25-.25h5a.25.25 0 0 1 .25.25v.25Zm-4 3a.75.75 0 0 0-1.5 0v6a.75.75 0 1 0 1.5 0v-6Zm4 0a.75.75 0 0 0-1.5 0v6a.75.75 0 1 0 1.5 0v-6Z" />
                  </svg>
                </span>
                Delete
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
}
