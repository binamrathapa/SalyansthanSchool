// SECTION TYPE
export interface Section {
  id: number;
  name: string;
}

// GRADE (GET RESPONSE)
export interface Grade {
  id: number;
  name: string;
  sections: Section[];
  isActive: boolean;
  createdAt: string;
}

// CREATE GRADE
export interface CreateGradePayload {
  name: string;
  isActive: boolean;
  sectionId: number;
  createdAt?: string;
}

// UPDATE GRADE
export interface UpdateGradePayload {
  id: number;
  name?: string;
  isActive?: boolean;
  sectionId?: number;
  createdAt?: string;
}
