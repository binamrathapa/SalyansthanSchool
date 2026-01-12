export interface Student {
  id: number;
  fullName: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  rollNo: string;
  gradeId: number;
  grade: string;
  sectionId: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  dateOfBirth: string; 
  admissionDate: string; 
  address: string;
  guardianName: string;
  guardianContact: string;
  gradeName: string;
  photo: string | null;
  isActive: boolean;
  createdAt: string; 
}
