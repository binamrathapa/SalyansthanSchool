export interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AcademicYearPayload {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UpdateAcademicYearPayload extends AcademicYearPayload {
  id: number;
}

// Metadata interface based on your response
export interface AcademicYearMeta {
  pageNumber: number;
  pageSize: number;
  total: number;
  isActive: boolean | null;
}