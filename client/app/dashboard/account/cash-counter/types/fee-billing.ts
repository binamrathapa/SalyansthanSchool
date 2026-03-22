// =============================================
// Student API Response Types (from /api/students)
// =============================================

export interface ApiStudent {
  id: number;
  fullName: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  admissionDate: string;
  address: string;
  guardianName: string;
  guardianContact: string;
  rollNo: number;
  gradeId: number;
  gradeName: string;
  sectionId: number;
  sectionName: string | null;
  photo: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ApiStudentResponse {
  data: ApiStudent[];
}

// =============================================
// Financial / Fee Billing Types (from /api/students/:id/billing)
// =============================================

export type PaymentStatus = "PAID" | "PARTIAL" | "UNPAID";

export interface StudentInfo {
  student_id: number;
  admission_no: string;
  name: string;
  class: string;
  section: string;
  roll_no: number;
  status: string;
}

export interface FeeStructure {
  tuition_fee: number;
  exam_fee: number;
  transport_fee: number;
  hostel_fee: number;
  library_fee: number;
  base_amount: number;
}

export interface Discount {
  type: string;
  amount: number;
  remarks: string;
}

export interface PreviousDue {
  total_due: number;
  last_due_month: string;
}

export interface CurrentMonthPayment {
  base_amount: number;
  discount: number;
  previous_due: number;
  total_payable: number;
  paid_amount: number;
  remaining_amount: number;
  status: PaymentStatus;
}

export interface YearSummary {
  total_year_fee: number;
  total_discount: number;
  total_paid: number;
  total_due: number;
}

export interface PaymentHistory {
  payment_id: number;
  month: string;
  amount: number;
  paid_amount: number;
  status: PaymentStatus;
  date: string;
  receipt_no: string;
  method: string;
}

export interface FeeBillingResponse {
  student: StudentInfo;
  academic_year: string;
  current_month: string;
  fee_structure: FeeStructure;
  discount: Discount;
  previous_due: PreviousDue;
  current_month_payment: CurrentMonthPayment;
  year_summary: YearSummary;
  payment_history: PaymentHistory[];
}
