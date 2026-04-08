export interface AcademicYear {
  id: number;
  name: string;
}

export interface ClassItem {
  id: number;
  name: string;
}

export interface Section {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  admission_no: string;
  class: string;
  section: string;
  roll_no: string | number;
  photo?: string;
  isActive?: boolean;
}

export interface FeeStructure {
  id: number;
  academicYear: string;
  class: string;
  feeHead: string;
  amount: number;
  type: string;
}

export interface RecentAssignment {
  id: number;
  targetType: string;
  targetName: string;
  class: string;
  section: string;
  feeHead: string;
  amount: number;
  month: string;
  academicYear: string;
  assignedOn: string;
  type: string;
}

export interface AssignmentData {
  academicYears: AcademicYear[];
  classes: ClassItem[];
  sections: Section[];
  students: Student[];
  feeStructures: FeeStructure[];
  months: string[];
  recentAssignments: RecentAssignment[];
}
