export interface StudentDiscount {
  id: number;
  studentId: number;
  studentName: string;
  feeHeadName: string;
  feeHeadId: number;
  academicYearName: string;
  academicYearId: number;
  discountAmount: number;
  discountValue: number;
  isPercentage: boolean;
  maxDiscountAmount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface StudentDiscountPayload {
  studentId: number;
  feeHeadId: number;
  academicYearId: number;
  discountValue: number;
  isPercentage: boolean;
  maxDiscountAmount: number;
  validFrom: string;
  validTo: string;
}

export interface UpdateStudentDiscountPayload extends StudentDiscountPayload {
  id: number;
}

export interface StudentDiscountQueryParameters {
  pageNumber?: number;
  pageSize?: number;
  studentId?: number;
  feeHeadId?: number;
  academicYearId?: number;
}
