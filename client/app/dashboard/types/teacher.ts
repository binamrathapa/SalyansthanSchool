export type Teacher = {
  id: number;
  employeeCode: string;
  fullName: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  email: string;
  mobileNo: string;
  address?: string | null;
  panNumber: string;
  qualification: string;
  joiningDate: string;
  photo?: string | null;
  isActive: boolean;
  createdAt: string;
  nidNumber?: string;
};

// CREATE/UPDATE
export type CreateTeacherPayload = FormData;
export type UpdateTeacherPayload = Partial<Teacher> & { id: number };

// QUERY PARAMETERS
export type TeacherQueryParameters = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  isActive?: boolean;
  qualification?: string;
  gender?: string;
};

