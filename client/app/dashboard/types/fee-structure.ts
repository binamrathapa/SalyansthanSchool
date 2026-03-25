export interface FeeStructure {
  id: number;
  academicYearId:number;
  academicYearName:string;
  gradeId: number;      // Linking to a specific Grade
  gradeName?: string;
  feeHeadId: number;    // Linking to the Fee Head we made earlier 
  feeHeadName?: string;
  amount: number;       // The actual cost
  isMonthly: boolean;
  description?: string;
  createdAt: string;
}

export interface FeeStructurePayload {
  academicYearId: number
  gradeId: number
  feeHeadId: number
  amount: number
  isMonthly: boolean
  description?: string
}

export interface UpdateFeeStructurePayload extends FeeStructurePayload {
  id: number;
}