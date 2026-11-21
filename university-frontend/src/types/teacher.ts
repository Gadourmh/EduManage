export interface Teacher {
  id: number | string;
  fullName?: string;
  name?: string;
  email?: string;
}

export interface TeacherPayload {
  // Kept flexible since your backend may return different teacher fields.
  fullName?: string;
  name?: string;
}

