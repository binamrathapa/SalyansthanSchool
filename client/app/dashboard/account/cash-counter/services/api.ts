import { ApiStudent, FeeBillingResponse } from "../types/fee-billing";

// =============================================
// API CONFIGURATION
// =============================================
// Replace these with your actual API base URL and endpoints
// When connecting to your real backend, set USE_MOCK_DATA = false

const API_BASE_URL = ""; // e.g. "https://your-api.com/api"
const USE_MOCK_DATA = true; // Set to false when using real API

// =============================================
// API FUNCTIONS
// =============================================

/**
 * Fetch all students from the Student API
 * Endpoint: GET /api/students
 * Response: { data: ApiStudent[] }
 */
export async function fetchStudents(): Promise<ApiStudent[]> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_STUDENTS;
  }

  const response = await fetch(`${API_BASE_URL}/students`);
  if (!response.ok) {
    throw new Error(`Failed to fetch students: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data;
}

/**
 * Fetch financial/billing data for a specific student
 * Endpoint: GET /api/students/:id/billing
 * Response: FeeBillingResponse
 */
export async function fetchStudentBilling(
  studentId: number
): Promise<FeeBillingResponse> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 400));
    const data = getMockBilling(studentId);
    if (!data) throw new Error("Student billing data not found");
    return data;
  }

  const response = await fetch(
    `${API_BASE_URL}/students/${studentId}/billing`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch billing for student ${studentId}: ${response.statusText}`
    );
  }
  return response.json();
}

/**
 * Post a payment collection
 * Endpoint: POST /api/students/:id/payments
 */
export async function postPayment(payload: {
  studentId: number;
  amount: number;
  method: string;
  remarks: string;
}): Promise<{ receipt_no: string; success: boolean }> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 300));
    return {
      receipt_no: `RCP${Date.now().toString().slice(-6)}`,
      success: true,
    };
  }

  const response = await fetch(
    `${API_BASE_URL}/students/${payload.studentId}/payments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    throw new Error(`Payment failed: ${response.statusText}`);
  }
  return response.json();
}

// =============================================
// MOCK DATA — matches your actual API format
// =============================================

const MOCK_STUDENTS: ApiStudent[] = [
  {
    id: 104,
    fullName: "Gita Gurung",
    firstName: "Gita",
    middleName: null,
    lastName: "Gurung",
    gender: "Female",
    bloodGroup: "A+",
    dateOfBirth: "2012-07-01",
    admissionDate: "2025-06-26",
    address: "Kathmandu",
    guardianName: "Pooja Acharya",
    guardianContact: "9845922187",
    rollNo: 1,
    gradeId: 6,
    gradeName: "Four",
    sectionId: 2,
    sectionName: "B",
    photo: null,
    isActive: true,
    createdAt: "2026-01-17T11:55:19.223",
  },
  {
    id: 106,
    fullName: "Chiquita Serina Jenkins Wiggins",
    firstName: "Chiquita",
    middleName: "Serina Jenkins",
    lastName: "Wiggins",
    gender: "Female",
    bloodGroup: "O+",
    dateOfBirth: "2010-10-16",
    admissionDate: "2025-02-10",
    address: "Bhaktapur",
    guardianName: "Robert Wiggins",
    guardianContact: "9800000012",
    rollNo: 1,
    gradeId: 5,
    gradeName: "Three",
    sectionId: 0,
    sectionName: null,
    photo: null,
    isActive: true,
    createdAt: "2026-01-18T13:33:18.213",
  },
  {
    id: 108,
    fullName: "Ram Sharma",
    firstName: "Ram",
    middleName: null,
    lastName: "Sharma",
    gender: "Male",
    bloodGroup: "B+",
    dateOfBirth: "2011-03-15",
    admissionDate: "2024-04-01",
    address: "Lalitpur",
    guardianName: "Rajesh Sharma",
    guardianContact: "9876543210",
    rollNo: 12,
    gradeId: 10,
    gradeName: "Ten",
    sectionId: 1,
    sectionName: "A",
    photo: null,
    isActive: true,
    createdAt: "2025-04-01T09:00:00.000",
  },
  {
    id: 110,
    fullName: "Sita Thapa",
    firstName: "Sita",
    middleName: null,
    lastName: "Thapa",
    gender: "Female",
    bloodGroup: "AB+",
    dateOfBirth: "2012-08-22",
    admissionDate: "2024-04-15",
    address: "Pokhara",
    guardianName: "Hari Thapa",
    guardianContact: "9812345678",
    rollNo: 5,
    gradeId: 9,
    gradeName: "Nine",
    sectionId: 1,
    sectionName: "A",
    photo: null,
    isActive: true,
    createdAt: "2025-04-15T10:00:00.000",
  },
  {
    id: 112,
    fullName: "Bikash Karki",
    firstName: "Bikash",
    middleName: null,
    lastName: "Karki",
    gender: "Male",
    bloodGroup: "O-",
    dateOfBirth: "2013-01-10",
    admissionDate: "2024-05-01",
    address: "Chitwan",
    guardianName: "Deepak Karki",
    guardianContact: "9801234567",
    rollNo: 3,
    gradeId: 8,
    gradeName: "Eight",
    sectionId: 2,
    sectionName: "B",
    photo: null,
    isActive: true,
    createdAt: "2025-05-01T08:30:00.000",
  },
  {
    id: 114,
    fullName: "Anita Rai",
    firstName: "Anita",
    middleName: null,
    lastName: "Rai",
    gender: "Female",
    bloodGroup: "A-",
    dateOfBirth: "2011-11-05",
    admissionDate: "2024-04-01",
    address: "Biratnagar",
    guardianName: "Kumar Rai",
    guardianContact: "9867890123",
    rollNo: 8,
    gradeId: 10,
    gradeName: "Ten",
    sectionId: 2,
    sectionName: "B",
    photo: null,
    isActive: true,
    createdAt: "2025-04-01T09:00:00.000",
  },
  {
    id: 116,
    fullName: "Suresh Tamang",
    firstName: "Suresh",
    middleName: null,
    lastName: "Tamang",
    gender: "Male",
    bloodGroup: "B-",
    dateOfBirth: "2013-05-20",
    admissionDate: "2024-06-01",
    address: "Hetauda",
    guardianName: "Binod Tamang",
    guardianContact: "9845678901",
    rollNo: 7,
    gradeId: 7,
    gradeName: "Seven",
    sectionId: 1,
    sectionName: "A",
    photo: null,
    isActive: true,
    createdAt: "2025-06-01T10:00:00.000",
  },
  {
    id: 118,
    fullName: "Priya Shrestha",
    firstName: "Priya",
    middleName: null,
    lastName: "Shrestha",
    gender: "Female",
    bloodGroup: "AB-",
    dateOfBirth: "2012-02-14",
    admissionDate: "2024-04-01",
    address: "Kirtipur",
    guardianName: "Mohan Shrestha",
    guardianContact: "9823456789",
    rollNo: 4,
    gradeId: 9,
    gradeName: "Nine",
    sectionId: 2,
    sectionName: "B",
    photo: null,
    isActive: true,
    createdAt: "2025-04-01T09:30:00.000",
  },
  {
    id: 120,
    fullName: "Arjun Basnet",
    firstName: "Arjun",
    middleName: null,
    lastName: "Basnet",
    gender: "Male",
    bloodGroup: "O+",
    dateOfBirth: "2014-09-30",
    admissionDate: "2025-04-01",
    address: "Butwal",
    guardianName: "Prakash Basnet",
    guardianContact: "9856789012",
    rollNo: 2,
    gradeId: 6,
    gradeName: "Six",
    sectionId: 1,
    sectionName: "A",
    photo: null,
    isActive: true,
    createdAt: "2025-04-01T08:00:00.000",
  },
  {
    id: 122,
    fullName: "Maya Lama",
    firstName: "Maya",
    middleName: null,
    lastName: "Lama",
    gender: "Female",
    bloodGroup: "A+",
    dateOfBirth: "2013-12-25",
    admissionDate: "2024-04-01",
    address: "Dharan",
    guardianName: "Dorje Lama",
    guardianContact: "9834567890",
    rollNo: 6,
    gradeId: 8,
    gradeName: "Eight",
    sectionId: 1,
    sectionName: "A",
    photo: null,
    isActive: true,
    createdAt: "2025-04-01T09:00:00.000",
  },
  {
    id: 124,
    fullName: "Rajan Adhikari",
    firstName: "Rajan",
    middleName: null,
    lastName: "Adhikari",
    gender: "Male",
    bloodGroup: "B+",
    dateOfBirth: "2012-06-18",
    admissionDate: "2024-04-01",
    address: "Nepalgunj",
    guardianName: "Shyam Adhikari",
    guardianContact: "9878901234",
    rollNo: 10,
    gradeId: 9,
    gradeName: "Nine",
    sectionId: 1,
    sectionName: "A",
    photo: null,
    isActive: false,
    createdAt: "2025-04-01T09:00:00.000",
  },
  {
    id: 126,
    fullName: "Nisha Maharjan",
    firstName: "Nisha",
    middleName: null,
    lastName: "Maharjan",
    gender: "Female",
    bloodGroup: "O+",
    dateOfBirth: "2014-04-10",
    admissionDate: "2025-04-01",
    address: "Patan",
    guardianName: "Sujan Maharjan",
    guardianContact: "9889012345",
    rollNo: 9,
    gradeId: 7,
    gradeName: "Seven",
    sectionId: 2,
    sectionName: "B",
    photo: null,
    isActive: true,
    createdAt: "2025-04-01T08:30:00.000",
  },
];

// Generate mock billing data for any student
function getMockBilling(studentId: number): FeeBillingResponse | null {
  const student = MOCK_STUDENTS.find((s) => s.id === studentId);
  if (!student) return null;

  // Different fee structures per grade
  const feeByGrade: Record<number, { tuition: number; exam: number; transport: number; hostel: number; library: number }> = {
    5:  { tuition: 800,  exam: 300, transport: 600, hostel: 0, library: 150 },
    6:  { tuition: 900,  exam: 350, transport: 650, hostel: 0, library: 150 },
    7:  { tuition: 1000, exam: 400, transport: 700, hostel: 0, library: 200 },
    8:  { tuition: 1100, exam: 450, transport: 750, hostel: 0, library: 200 },
    9:  { tuition: 1200, exam: 500, transport: 800, hostel: 0, library: 200 },
    10: { tuition: 1500, exam: 600, transport: 800, hostel: 0, library: 250 },
  };

  const gradeFee = feeByGrade[student.gradeId] || feeByGrade[10];
  const baseAmount = gradeFee.tuition + gradeFee.exam + gradeFee.transport + gradeFee.hostel + gradeFee.library;

  // Deterministic "random" values based on student id
  const seed = studentId;
  const discountTypes = ["Scholarship", "Sibling Discount", "Staff Ward", "Merit Based", "None"];
  const discountType = discountTypes[seed % discountTypes.length];
  const discountAmount = discountType === "None" ? 0 : 100 + (seed % 4) * 50;

  const previousDue = (seed % 3) * 500;
  const totalPayable = baseAmount - discountAmount + previousDue;
  const paidAmount = Math.min(totalPayable, Math.floor(totalPayable * (0.4 + (seed % 5) * 0.15)));
  const remainingAmount = totalPayable - paidAmount;

  let status: "PAID" | "PARTIAL" | "UNPAID" = "UNPAID";
  if (remainingAmount === 0) status = "PAID";
  else if (paidAmount > 0) status = "PARTIAL";

  const months = ["January", "February", "March", "April", "May", "June", "July", "August"];
  const currentMonth = months[new Date().getMonth()] || "March";
  const paymentMethods = ["Cash", "Online", "Bank Transfer", "Cheque"];

  // Generate payment history
  const paymentHistory = [];
  for (let i = 0; i < Math.min(months.indexOf(currentMonth) + 1, 8); i++) {
    const monthAmt = baseAmount - discountAmount;
    const monthPaid = i < months.indexOf(currentMonth) 
      ? monthAmt 
      : paidAmount;
    paymentHistory.push({
      payment_id: i + 1,
      month: months[i],
      amount: monthAmt + (i === 0 ? 0 : 0),
      paid_amount: monthPaid,
      status: (monthPaid >= monthAmt ? "PAID" : monthPaid > 0 ? "PARTIAL" : "UNPAID") as "PAID" | "PARTIAL" | "UNPAID",
      date: `2025-${String(i + 1).padStart(2, "0")}-${String(5 + (seed % 20)).padStart(2, "0")}`,
      receipt_no: `RCPT-${1000 + studentId + i}`,
      method: paymentMethods[(seed + i) % paymentMethods.length],
    });
  }

  const admissionNo = `ADM-${new Date(student.admissionDate).getFullYear()}-${String(student.id).padStart(3, "0")}`;

  return {
    student: {
      student_id: student.id,
      admission_no: admissionNo,
      name: student.fullName,
      class: student.gradeName,
      section: student.sectionName || "-",
      roll_no: student.rollNo,
      status: student.isActive ? "Active" : "Inactive",
    },
    academic_year: "2025-2026",
    current_month: currentMonth,
    fee_structure: {
      tuition_fee: gradeFee.tuition,
      exam_fee: gradeFee.exam,
      transport_fee: gradeFee.transport,
      hostel_fee: gradeFee.hostel,
      library_fee: gradeFee.library,
      base_amount: baseAmount,
    },
    discount: {
      type: discountType,
      amount: discountAmount,
      remarks: discountType === "None" ? "No discount applied" : `${discountType} - approved by admin`,
    },
    previous_due: {
      total_due: previousDue,
      last_due_month: previousDue > 0 ? months[Math.max(0, months.indexOf(currentMonth) - 1)] : "-",
    },
    current_month_payment: {
      base_amount: baseAmount,
      discount: discountAmount,
      previous_due: previousDue,
      total_payable: totalPayable,
      paid_amount: paidAmount,
      remaining_amount: remainingAmount,
      status,
    },
    year_summary: {
      total_year_fee: baseAmount * 12,
      total_discount: discountAmount * 12,
      total_paid: paymentHistory.reduce((sum, p) => sum + p.paid_amount, 0),
      total_due: baseAmount * 12 - discountAmount * 12 - paymentHistory.reduce((sum, p) => sum + p.paid_amount, 0),
    },
    payment_history: paymentHistory.reverse(),
  };
}
