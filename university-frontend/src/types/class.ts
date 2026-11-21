import type { Teacher } from "./teacher";

export interface ClassDepartment {
  id: number | string;
  name: string;
}

export interface Class {
  id: number | string;
  name: string;

  // Either nested department or just the departmentId depending on your backend.
  department?: ClassDepartment | null;
  departmentId?: number | string;

  // Different backends may expose students count under different keys.
  studentsCount?: number;
  numberOfStudents?: number;

  // Assigned teachers may be returned as teacher objects or ids.
  teachers?: Teacher[];
  teacherIds?: Array<number | string>;
}

export interface ClassPayload {
  name: string;
  departmentId: number | string;
}

