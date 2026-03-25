"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Search,
  User,
  GraduationCap,
  ChevronRight,
  X,
  Filter,
  Wallet,
  AlertCircle,
  Receipt,
  BadgeDollarSign,
  CreditCard,
  Printer,
  UserSearch,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import PrintBill from "./components/PrintBill";
import PrintReceipt from "./components/PrintReceipt";
import { fetchStudentBilling } from "./services/api";
import { useGetAllStudents } from "@/server-action/api/student.api";

import {
  FeeBillingResponse,
  PaymentStatus,
  PaymentHistory,
} from "./types/fee-billing";
import ChildLoaderWrapper from "../../components/dashboard/common/ChildLoaderWrapper";
import GloabalLoadingWrapper from "../../components/dashboard/common/GlobalLoaderWrapper"; import CustomTable, {
  Column,
} from "@/app/dashboard/components/dashboard/common/CustomTable";
import { showConfirm, showError, showSuccess } from "@/lib/sweet-alert";
import { Student } from "../../types/student";
import { getPhotoUrl } from "@/server-action/utils/api";



/* ------------------------------------------------ */
/* HELPER COMPONENTS (unchanged) */
/* ------------------------------------------------ */

const StatusBadge = ({ status }: { status: string }) => {
  const styleMap: Record<string, string> = {
    PAID: "bg-green-50 text-green-600 border-green-200",
    PARTIAL: "bg-amber-50 text-amber-600 border-amber-200",
    UNPAID: "bg-rose-50 text-rose-600 border-rose-200",
    Active: "bg-green-50 text-green-600 border-green-200",
    Inactive: "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styleMap[status] || "bg-slate-50 text-slate-600 border-slate-200"
        }`}
    >
      {status}
    </span>
  );
};




const SummaryCard = ({
  title,
  value,
  icon,
  tone = "blue",
  sub,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  tone?: "blue" | "green" | "amber" | "rose" | "violet" | "slate";
  sub?: string;
}) => {
  const toneMap = {
    blue: "from-blue-500 to-indigo-500",
    green: "from-green-500 to-emerald-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
    violet: "from-violet-500 to-fuchsia-500",
    slate: "from-slate-500 to-slate-700",
  };

  const Icon = icon;

  //

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{value}</h3>
          {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div
          className={`h-8 w-8 rounded-lg bg-gradient-to-br ${toneMap[tone]} text-white flex items-center justify-center shadow-sm`}
        >
          <Icon size={14} />
        </div>
      </div>
    </div>
  );
};


const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;

/* ------------------------------------------------ */
/* MAIN APP */
/* ------------------------------------------------ */

export default function App() {


  //Table config 
  const paymentHistoryColumns: Column<PaymentHistory>[] = [
    {
      key: "sn",
      label: "S.N.",
      visible: true,
      exportable: true,
    },
    {
      key: "receipt_no",
      label: "Receipt No",
      visible: true,
      exportable: true,
      render: (row) => (
        <span className="font-mono text-xs">{row.receipt_no}</span>
      ),
    },
    {
      key: "month",
      label: "Month",
      visible: true,
      exportable: true,
    },
    {
      key: "paid_amount",
      label: "Amount",
      visible: true,
      exportable: true,
      render: (row) => money(row.paid_amount),
    },
    {
      key: "method",
      label: "Method",
      visible: true,
      exportable: true,
    },
    {
      key: "print",
      label: "",
      visible: true,
      exportable: false,
      render: (row) => (
        <button
          onClick={() => handleRowPrint(row)}
          className="p-1 hover:bg-slate-100 rounded cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-600" />
        </button>
      )
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      exportable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "date",
      label: "Date",
      visible: true,
      exportable: true,
    },
  ];

  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
    refetch,
  } = useGetAllStudents();

  const students: Student[] = Array.isArray(studentsData) ? studentsData : [];
  const studentErrorMessage = (studentsError as any)?.message || "Failed to load students";


  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Selected student & fee data from API
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeData, setFeeData] = useState<FeeBillingResponse | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastReceiptNo, setLastReceiptNo] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentHistory | null>(null);

  // Print refs
  const billRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrintBill = useReactToPrint({
    contentRef: billRef,
    documentTitle: feeData
      ? `Bill-${feeData.student.admission_no}-${feeData.current_month}`
      : "Bill",
  });

  const handlePrintReceipt = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: feeData
      ? `Receipt-${feeData.student.admission_no}-${feeData.current_month}`
      : "Receipt",
  });

  const handleRowPrint = (row: PaymentHistory) => {
    setSelectedReceipt(row);
      handlePrintReceipt();
  }
  // ──────────────────────────────────────────────
  // FILTERS (using ApiStudent fields)
  // ──────────────────────────────────────────────
  const grades = useMemo(() => {
    const unique = [...new Set(students.map((s) => s.gradeName))];
    return unique.sort();
  }, [students]);

  const sections = useMemo(() => {
    const unique = [
      ...new Set(
        students.map((s) => s.sectionName).filter(Boolean) as string[]
      ),
    ];
    return unique.sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        student.fullName.toLowerCase().includes(query) ||
        student.guardianName?.toLowerCase().includes(query) ||
        student.guardianContact?.includes(query) ||
        String(student.id).includes(query);

      const matchesClass =
        selectedClass === "all" || student.gradeName === selectedClass;
      const matchesSection =
        selectedSection === "all" || student.sectionName === selectedSection;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "Active" ? student.isActive : !student.isActive);

      return matchesSearch && matchesClass && matchesSection && matchesStatus;
    });
  }, [students, searchQuery, selectedClass, selectedSection, selectedStatus]);

  const activeStudents = useMemo(
    () => students.filter((s) => s.isActive).length,
    [students]
  );

  const hasActiveFilters =
    selectedClass !== "all" ||
    selectedSection !== "all" ||
    selectedStatus !== "all" ||
    searchQuery !== "";

  const clearFilters = () => {
    setSelectedClass("all");
    setSelectedSection("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  // ──────────────────────────────────────────────
  // HANDLE STUDENT SELECTION — fetch billing from API
  // ──────────────────────────────────────────────
  const handleSelectStudent = useCallback(async (student: Student) => {
    setSelectedStudent(student);
    setBillingLoading(true);
    setBillingError(null);
    setFeeData(null);
    setIsSuccess(false);

    try {
      const billingData = await fetchStudentBilling(student.id);
      setFeeData(billingData);
      setPaymentAmount(billingData.current_month_payment.remaining_amount);
      setPaymentMethod("Cash");
      setRemarks("");
    } catch (err: any) {
      setBillingError(err.message || "Failed to load billing data");
    } finally {
      setBillingLoading(false);
    }
  }, []);

  // ──────────────────────────────────────────────
  // HANDLE PAYMENT COLLECTION
  // ──────────────────────────────────────────────
  const handleCollectPayment = async () => {
    if (!feeData) return;

    if (paymentAmount <= 0) {
      showError("Please enter a valid payment amount");
      return;
    }

    const currentRemaining = feeData.current_month_payment.remaining_amount;
    if (paymentAmount > currentRemaining) {
      showError(
        `Payment amount cannot exceed remaining balance of ${money(currentRemaining)}`
      );
      return;
    }

    const isConfirm = await showConfirm(
      {
        title: "Confirm Payment",
        text: `Are you sure you want to collect ${money(paymentAmount)}?`,
        icon: "warning",
        confirmButtonText: "Yes, Collect",
        cancelButtonText: "Cancel"
      }
    );

    if (!isConfirm) return

    const newPaidAmount =
      feeData.current_month_payment.paid_amount + paymentAmount;
    const newRemainingAmount = currentRemaining - paymentAmount;

    let newStatus: PaymentStatus = "PAID";
    if (newRemainingAmount > 0) {
      newStatus = "PARTIAL";
    }

    const receiptNo = `RCP${Date.now().toString().slice(-6)}`;

    const newPayment: PaymentHistory = {
      payment_id:
        Math.max(0, ...feeData.payment_history.map((p) => p.payment_id)) + 1,
      month: feeData.current_month,
      amount: feeData.current_month_payment.total_payable,
      paid_amount: paymentAmount,
      status: newStatus,
      date: new Date().toISOString().split("T")[0],
      receipt_no: receiptNo,
      method: paymentMethod,
    };

    const updatedFeeData: FeeBillingResponse = {
      ...feeData,
      current_month_payment: {
        ...feeData.current_month_payment,
        paid_amount: newPaidAmount,
        remaining_amount: newRemainingAmount,
        status: newStatus,
      },
      year_summary: {
        ...feeData.year_summary,
        total_paid: feeData.year_summary.total_paid + paymentAmount,
        total_due: feeData.year_summary.total_due - paymentAmount,
      },
      payment_history: [newPayment, ...feeData.payment_history],
    };

    setFeeData(updatedFeeData);
    setLastReceiptNo(receiptNo);
    setIsSuccess(true);
    setPaymentAmount(newRemainingAmount > 0 ? newRemainingAmount : 0);
    setRemarks("");

    showSuccess(`Payment of ${money(paymentAmount)} collected successfully`);
    setTimeout(() => handlePrintReceipt(), 100);
  };

  // Bill breakdown
  const billBreakdown = useMemo(() => {
    if (!feeData) return [];
    return [
      { label: "Tuition Fee", amount: feeData.fee_structure.tuition_fee },
      { label: "Exam Fee", amount: feeData.fee_structure.exam_fee },
      { label: "Transport Fee", amount: feeData.fee_structure.transport_fee },
      { label: "Hostel Fee", amount: feeData.fee_structure.hostel_fee },
      { label: "Library Fee", amount: feeData.fee_structure.library_fee },
      {
        label: "Base Amount",
        amount: feeData.fee_structure.base_amount,
        strong: true,
      },
      {
        label: "Discount",
        amount: -feeData.current_month_payment.discount,
        highlight: "green",
      },
      {
        label: "Previous Due",
        amount: feeData.current_month_payment.previous_due,
        highlight: "amber",
      },
      {
        label: "Total Payable",
        amount: feeData.current_month_payment.total_payable,
        strong: true,
      },
      {
        label: "Paid Amount",
        amount: -feeData.current_month_payment.paid_amount,
        highlight: "blue",
      },
      {
        label: "Remaining",
        amount: feeData.current_month_payment.remaining_amount,
        strong: true,
        highlight: "rose",
      },
    ];
  }, [feeData]);

  return (
    <GloabalLoadingWrapper isLoading={studentsLoading}>
      <div className="min-h-screen bg-slate-100">
        {/* Hidden print components */}
        {feeData && (
          <div style={{ display: "none" }}>
            <div ref={billRef}>
              <PrintBill data={feeData} />
            </div>
            <div ref={receiptRef}>
              <PrintReceipt
                data={feeData}
                selectedPayment={selectedReceipt}
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <h1 className="text-xl font-extrabold text-slate-900">
            Fee Collection System
          </h1>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex flex-col xl:flex-row h-[calc(100vh-73px)]">
          {/* LEFT COLUMN - Search & Student List */}

          <div className="w-full xl:w-[360px] xl:min-w-[360px] border-r border-slate-200 bg-white flex flex-col">            {/* Search Input */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, guardian, phone, ID..."
                  className="w-full h-10 pl-10 pr-10 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent hover:bg-transparent"
                  >
                    <X className="h-4 w-4 hover:scale-110" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Filters
                </span>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    className="ml-auto bg-slate-700 hover:bg-slate-800 text-600  text-xs text-white hover:text-rose-700 font-medium "
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade ?? ""}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections.map((sec) => (
                      <SelectItem key={sec} value={sec}>
                        Section {sec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats Row */}
            <div className="p-4 border-b border-slate-100 flex gap-4 text-center">
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-900">{students.length}</p>
                <p className="text-[10px] text-slate-500 uppercase">Total</p>
              </div>
              <div className="flex-1 border-l border-slate-200">
                <p className="text-lg font-bold text-green-600">{activeStudents}</p>
                <p className="text-[10px] text-slate-500 uppercase">Active</p>
              </div>
              <div className="flex-1 border-l border-slate-200">
                <p className="text-lg font-bold text-blue-600">
                  {filteredStudents.length}
                </p>
                <p className="text-[10px] text-slate-500 uppercase">Results</p>
              </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto">
              {studentsError ? (
                <div className="p-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="h-6 w-6 text-rose-500" />
                  </div>

                  <p className="font-medium text-rose-700 text-sm">
                    {studentsError?.message}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="text-xs text-blue-600 hover:underline mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-700 text-sm">
                    No students found
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className={`p-4 cursor-pointer transition-colors group ${selectedStudent?.id === student.id
                        ? "bg-green-50 border-l-4 border-l-green-500"
                        : "hover:bg-slate-50 border-l-4 border-l-transparent"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${selectedStudent?.id === student.id
                            ? "bg-green-500 text-white"
                            : "bg-green-100 text-slate-500"
                            }`}
                        >
                          {
                            student.photo ? (
                              <img src={getPhotoUrl(student.photo)}
                                alt={student.firstName}
                                className="h-full w-full object-cover rounded-full w-16"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <User />
                            )
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900 text-sm truncate">
                              {student.fullName}
                            </h4>
                            <StatusBadge
                              status={student.isActive ? "Active" : "Inactive"}
                            />
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {student.gradeName}
                              {student.sectionName ? `-${student.sectionName}` : ""}
                            </span>
                            <span>Roll: {student.rollNo}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {student.guardianName} • {student.guardianContact}
                          </p>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 flex-shrink-0 ${selectedStudent?.id === student.id
                            ? "text-blue-500"
                            : "text-slate-300 group-hover:text-slate-500"
                            }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Fee Billing Details */}
          <div className="flex-1 overflow-y-auto">
            <ChildLoaderWrapper isLoading={billingLoading}>
              {!selectedStudent ? (
                /* No Student Selected */
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <UserSearch className="h-10 w-10 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">
                      Select a Student
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Search and select a student from the list to view their fee
                      details, collect payments, and print receipts.
                    </p>
                  </div>
                </div>
              ) : billingError ? (
                /* Error loading billing */
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-rose-500" />
                    </div>
                    <h2 className="text-lg font-bold text-rose-700 mb-2">
                      Failed to Load Billing
                    </h2>
                    <p className="text-slate-500 text-sm mb-4">{billingError}</p>
                    <Button
                      onClick={() => handleSelectStudent(selectedStudent)}
                      className="rounded-lg bg-blue-600 hover:bg-blue-700 text-sm h-9 px-4"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              ) : feeData ? (
                /* Student Fee Details */
                <div className="p-6 space-y-5">
                  {/* Header with Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Fee Billing - {feeData.current_month}
                      </h2>
                      <p className="text-sm text-slate-500">
                        Academic Year: {feeData.academic_year}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handlePrintBill}
                        className="rounded-lg text-sm h-9 px-3 cursor-pointer"
                      >
                        <Printer className="h-4 w-4 mr-1.5" />
                        Print Bill
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handlePrintReceipt}
                        className="rounded-lg text-sm h-9 px-3 cursor-pointer"
                      >
                        <Receipt className="h-4 w-4 mr-1.5" />
                        Print Receipt
                      </Button>
                    </div>
                  </div>

                  {/* Student Info + Summary Cards Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">

                      {/* TOP: Image + Name */}
                      <div className="flex items-center gap-3">
                        <div className="h-22 w-22 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                          {selectedStudent?.photo ? (
                            <img
                              src={getPhotoUrl(selectedStudent.photo)}
                              alt={selectedStudent.fullName}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <User className="h-6 w-6 text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 ">
                              {selectedStudent?.fullName}
                            </h3>
                            <StatusBadge
                              status={selectedStudent?.isActive ? "Active" : "Inactive"}
                            />
                          </div>

                          <p className="text-xs text-slate-500 mt-0.5">
                            Roll No.: {selectedStudent?.id}
                          </p>
                        </div>
                      </div>

                      {/*  DETAILS FULL WIDTH (2 per row) */}
                      <div className="mt-4 space-y-2 text-sm text-slate-700">

                        {/* Row 1 */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <span className="text-slate-400 text-xs">Guardian</span>
                            <p className="font-medium">{selectedStudent?.guardianName}</p>
                          </div>
                          <div className="flex-1">
                            <span className="text-slate-400 text-xs">Contact</span>
                            <p className="font-medium">{selectedStudent?.guardianContact}</p>
                          </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <span className="text-slate-400 text-xs">Address</span>
                            <p className="font-medium">
                              {selectedStudent?.address || "-"}
                            </p>
                          </div>
                          <div className="flex-1">
                            <span className="text-slate-400 text-xs">DOB</span>
                            <p className="font-medium">
                              {selectedStudent?.dateOfBirth || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Row 3 */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <span className="text-slate-400 text-xs">Class</span>
                            <p className="font-medium">
                              {selectedStudent?.gradeName}
                            </p>
                          </div>
                          <div className="flex-1">
                            <span className="text-slate-400 text-xs">Section</span>
                            <p className="font-medium">
                              {selectedStudent?.sectionName || "-"}
                            </p>
                          </div>
                        </div>


                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <SummaryCard
                        title="Total Payable"
                        value={money(feeData.current_month_payment.total_payable)}
                        icon={BadgeDollarSign}
                        tone="blue"
                      />
                      <SummaryCard
                        title="Paid Amount"
                        value={money(feeData.current_month_payment.paid_amount)}
                        icon={CreditCard}
                        tone="green"
                      />
                      <SummaryCard
                        title="Remaining"
                        value={money(feeData.current_month_payment.remaining_amount)}
                        icon={AlertCircle}
                        tone="rose"
                        sub={feeData.current_month_payment.status}
                      />
                      <SummaryCard
                        title="Previous Due"
                        value={money(feeData.previous_due.total_due)}
                        icon={AlertCircle}
                        tone="amber"
                      />
                      <SummaryCard
                        title="Year Paid"
                        value={money(feeData.year_summary.total_paid)}
                        icon={Wallet}
                        tone="violet"
                      />
                      <SummaryCard
                        title="Year Due"
                        value={money(feeData.year_summary.total_due)}
                        icon={Receipt}
                        tone="slate"
                      />
                    </div>
                  </div>

                  {/* Bill Breakdown + Collect Payment Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Bill Breakdown */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">
                            Bill Breakdown
                          </h3>
                          <p className="text-xs text-slate-500">
                            Fee calculation for {feeData.current_month}
                          </p>
                        </div>
                        <StatusBadge status={feeData.current_month_payment.status} />
                      </div>
                      <div className="divide-y divide-slate-100">
                        {billBreakdown.map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between px-4 py-2.5 ${item.strong ? "bg-slate-50" : ""
                              }`}
                          >
                            <p
                              className={`text-sm ${item.strong
                                ? "font-bold text-slate-900"
                                : "text-slate-600"
                                }`}
                            >
                              {item.label}
                            </p>
                            <p
                              className={`text-sm font-semibold ${item.highlight === "green"
                                ? "text-green-600"
                                : item.highlight === "amber"
                                  ? "text-amber-600"
                                  : item.highlight === "blue"
                                    ? "text-blue-600"
                                    : item.highlight === "rose"
                                      ? "text-rose-600"
                                      : "text-slate-900"
                                }`}
                            >
                              {item.amount < 0
                                ? `- ${money(Math.abs(item.amount))}`
                                : money(item.amount)}
                            </p>
                          </div>
                        ))}
                      </div>
                      {feeData.discount?.amount > 0 && (
                        <div className="m-4 rounded-lg bg-green-50 border border-green-100 p-3">
                          <p className="text-xs font-semibold text-green-700">
                            Discount: {feeData.discount.type}
                          </p>
                          <p className="text-xs text-green-600 mt-0.5">
                            {feeData.discount.remarks}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Collect Payment */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-full">
                      <h3 className="font-bold text-slate-900 text-sm mb-1">
                        Collect Payment
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Receive payment and generate receipt
                      </p>

                      <div className="space-y-3 flex-1">
                        <div>
                          <label className="text-xs font-medium text-slate-600 block mb-1">
                            Payable Amount
                          </label>
                          <div className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 flex items-center text-sm font-semibold text-slate-800">
                            {money(feeData.current_month_payment.remaining_amount)}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-slate-600 block mb-1">
                            Receive Amount
                          </label>
                          <Input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                            className="w-full h-10 rounded-lg border border-green-200 px-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
                            placeholder="Enter amount"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-slate-600 block mb-1">
                            Payment Method
                          </label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="w-full h-10 text-sm bg-white">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Online">Online</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Cheque">Cheque</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-slate-600 block mb-1">
                            Remarks
                          </label>
                          <Textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                            placeholder="Optional note..."
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleCollectPayment}
                        className="w-full h-10 rounded-lg bg-green-600 hover:bg-green-700 text-sm"
                        disabled={
                          feeData.current_month_payment.remaining_amount === 0
                        }
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        {feeData.current_month_payment.remaining_amount === 0
                          ? "Fully Paid"
                          : "Collect Payment"}
                      </Button>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <div className="mb-4">
                      <h3 className="font-bold text-slate-900 text-sm">
                        Payment History
                      </h3>
                      <p className="text-xs text-slate-500">
                        Recent payment records
                      </p>
                    </div>

                    <CustomTable<PaymentHistory>
                      caption="Payment history"
                      data={feeData.payment_history}
                      columns={paymentHistoryColumns}
                      limit={5}
                      searchableKeys={
                        ["receipt_no"]
                      }
                      filterOptions={
                        [
                          { label: "Cash", value: "Cash", key: "method" },
                          { label: "Bank Transfer", value: "Bank Transfer", key: "method" },
                          { label: "Card", value: "Card", key: "method" },
                          { label: "Online", value: "Online", key: "method" },]
                      }
                    />
                  </div>
                </div>
              ) : null}
            </ChildLoaderWrapper>
          </div>
        </div>
      </div>
    </GloabalLoadingWrapper>
  );
}