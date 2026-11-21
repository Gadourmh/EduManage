export interface Department {
  id: number | string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentPayload {
  name: string;
}
