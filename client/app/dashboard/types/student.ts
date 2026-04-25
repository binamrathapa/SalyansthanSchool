export type Student = {
  id: number;

  firstName: string;
  middleName?: string | null;
  lastName: string;

  fullName: string;

  rollNo?: number;            

  gender?: "Male" | "Female" | "Other" | null;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

  dateOfBirth?: string | null;
  admissionDate: string;

  address?: string | null;
  guardianName?: string | null;
  guardianContact?: string | null;

  gradeId: number;
  gradeName?: string | null;

  
  sectionId: number;
  sectionName?: string | null;
  
  photo?: string | null;

  isActive: boolean;
  createdAt: string;
};

// CREATE (INSERT)
export type CreateStudentPayload = {
  firstName: string;
  middleName?: string;
  lastName: string;

  gender: string;
  bloodGroup?: string;

  dateOfBirth?: string;
  admissionDate: string;

  address?: string;
  guardianName?: string;
  guardianContact?: string;

  gradeId: number;
  sectionId: number;

  isActive: boolean;

  photoFile?: File;
};

// UPDATE (PUT)
export type UpdateStudentPayload = {
  id: number;

  firstName: string;
  middleName?: string;
  lastName: string;

  gender: string;
  bloodGroup?: string;

  dateOfBirth?: string;
  admissionDate: string;

  address?: string;
  guardianName?: string;
  guardianContact?: string;

  gradeId: number;
  sectionId: number;

  isActive: boolean;

  photoFile?: File;
};

// PATCH (OPTIONAL)
export type PatchStudentPayload = {
  id: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  guardianName?: string;
  guardianContact?: string;
  gradeId?: number;
  sectionId?: number;
  isActive?: boolean;
  photoFile?: File;
};
// QUERY PARAMETERS
export type StudentQueryParameters = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  isActive?: boolean;
  gradeId?: number;
  sectionId?: number;
};

// PAGINATED RESPONSE
export type StudentPaginatedResponse = {
  data: Student[];
  meta: {
    pageNumber: number;
    pageSize: number;
    total: number;
  };
};
