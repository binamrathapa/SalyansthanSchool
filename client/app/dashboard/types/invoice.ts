export interface GenerateMonthlyInvoicePayload {
  academicYearId: number;
  billingMonth: number;
  dueDate: string;
  gradeId?: number;
  sectionId?: number;
  studentId?: number;
  feeStructureIds: number[];
  customItems?: {
    feeHeadId: number;
    amount: number;
    description: string;
  }[];
  isReplace: boolean;
}

export interface Invoice {
  id: number;
  studentId: number;
  academicYearId: number;
  invoiceNo: string;
  billingMonth?: number;
  totalAmount: number;
  dueDate: string;
  status: number;
  createdAt: string;
  discountAmount: number;
  previousDue: number;
  paidAmount: number;
  remainingAmount: number;
  receiptNo?: string;
  updatedAt?: string;
}
