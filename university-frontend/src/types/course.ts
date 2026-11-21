import type { Class } from "./class";
import type { Teacher } from "./teacher";

export interface CourseClass {
  id: number | string;
  name: string;
}

export interface Course {
  id: number | string;
  name: string;

  // Nested objects (preferred) or just ids depending on backend.
  class?: CourseClass | null;
  classId?: number | string;

  teacher?: Teacher | null;
  teacherId?: number | string;
}

export interface CoursePayload {
  name: string;
  classId: number | string;
  teacherId: number | string;
}

