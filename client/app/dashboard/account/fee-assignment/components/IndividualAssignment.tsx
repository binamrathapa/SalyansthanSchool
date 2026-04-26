import { useState, useMemo, useEffect } from "react";
import {
  Search, Check, Loader2, X, RotateCcw, ChevronRight,
  Calendar, StickyNote, UserCheck, BookOpen,
  GraduationCap, Hash, Users, Phone, Mail, Home,
  ArrowRight, CheckCircle2, Tag, Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import AssignmentPreview from "./shared/AssignmentPreview";
import { AssignmentData } from "../types";
import { useGetAllStudentsPaginated } from "@/server-action/api/student.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPhotoUrl } from "@/server-action/utils/api";
import { useGetAllFeeHeads } from "@/server-action/api/feeHead";
import {
  useGetAllDiscounts,
  useCreateDiscount,
  useDeleteDiscount,
  useToggleDiscountStatus,
} from "@/server-action/api/discount.api";
import CustomTable from "@/app/dashboard/components/dashboard/common/CustomTable";
import { discountColumns } from "@/app/dashboard/config/table/discountTableConfig";
import { StudentDiscountPayload } from "@/app/dashboard/types/discount";
import { showSuccess, showError, showConfirm } from "@/lib/sweet-alert";

interface IndividualAssignmentProps {
  data: AssignmentData;
  onAssign: (payload: any) => void;
}

const TABS = [
  { id: "student", label: "Student", icon: UserCheck, step: 1 },
  { id: "details", label: "Fee & Period", icon: BookOpen, step: 2 },
  { id: "discount", label: "Discounts", icon: Tag, step: 3 },
  { id: "remarks", label: "Remarks", icon: StickyNote, step: 4 },
];

const panelSubtitles: Record<string, string> = {
  student: "Select a student to assign fees",
  details: "Choose billing cycle and fee structures",
  discount: "Apply fee concessions for this student",
  remarks: "Add an optional note",
};

export default function IndividualAssignment({ data, onAssign }: IndividualAssignmentProps) {
  const [activeTab, setActiveTab] = useState("student");
  const [studentQuery, setStudentQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [targetGradeId, setTargetGradeId] = useState<string>("all");
  const [targetSectionId, setTargetSectionId] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [academicYear, setAcademicYear] = useState("");
  const [month, setMonth] = useState("");
  const [selectedStructureIds, setSelectedStructureIds] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");

  // Discount form state
  const [discountFormData, setDiscountFormData] = useState<Partial<StudentDiscountPayload>>({
    academicYearId: 0,
    discountValue: 0,
    isPercentage: false,
    maxDiscountAmount: 0,
    validFrom: new Date().toISOString().split("T")[0],
    validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
  });

  const { data: feeHeads = [] } = useGetAllFeeHeads();
  const { data: discounts = [], isLoading: isLoadingDiscounts } = useGetAllDiscounts();
  const createDiscountMutation = useCreateDiscount();
  const deleteDiscountMutation = useDeleteDiscount();
  const toggleDiscountMutation = useToggleDiscountStatus();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(studentQuery), 400);
    return () => clearTimeout(t);
  }, [studentQuery]);

  const { data: studentsApiResponse, isLoading: isLoadingStudents } =
    useGetAllStudentsPaginated({
      search: debouncedQuery,
      gradeId: targetGradeId !== "all" ? Number(targetGradeId) : undefined,
      sectionId: targetSectionId !== "all" ? Number(targetSectionId) : undefined,
      pageSize: 20,
    });

  const students = studentsApiResponse?.data || [];

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId),
    [selectedStudentId, students]
  );

  const structureOptions = useMemo(() => {
    if (!selectedStudent || !academicYear) return [];
    return data.feeStructures.filter(
      (item) => item.academicYear === academicYear && item.class === selectedStudent.gradeName
    );
  }, [selectedStudent, academicYear, data.feeStructures]);

  const selectedStructures = useMemo(
    () => data.feeStructures.filter((item) => selectedStructureIds.includes(item.id.toString())),
    [selectedStructureIds, data.feeStructures]
  );

  const totalAmount = useMemo(
    () => selectedStructures.reduce((sum, item) => sum + item.amount, 0),
    [selectedStructures]
  );

  const studentDiscounts = useMemo(
    () => discounts.filter((d: any) => d.studentId === selectedStudentId),
    [discounts, selectedStudentId]
  );

  const handleCreateDiscount = async () => {
    if (!selectedStudentId || !discountFormData.feeHeadId || !discountFormData.academicYearId) {
      showError("Please fill all required discount fields");
      return;
    }

    try {
      await createDiscountMutation.mutateAsync({
        ...(discountFormData as StudentDiscountPayload),
        studentId: selectedStudentId,
      });
      showSuccess("Discount created successfully");
      setDiscountFormData(prev => ({ ...prev, feeHeadId: 0, discountValue: 0 }));
    } catch (error: any) {
      const errorMessage = typeof error === "string" ? error : error?.message || "Failed to create discount";
      showError(errorMessage);
    }
  };

  const tabDone: Record<string, boolean> = {
    student: !!selectedStudentId,
    details: !!(academicYear && month && selectedStructureIds.length > 0),
    discount: false,
    remarks: true,
  };

  const tabEnabled: Record<string, boolean> = {
    student: true,
    details: !!selectedStudentId,
    discount: !!(selectedStudentId && academicYear),
    remarks: !!(selectedStructureIds.length > 0 && academicYear && month),
  };

  const canAssign = selectedStudentId && academicYear && month && selectedStructureIds.length > 0;

  const handleReset = () => {
    setStudentQuery(""); setDebouncedQuery("");
    setTargetGradeId("all"); setTargetSectionId("all");
    setSelectedStudentId(null);
    setAcademicYear(""); setMonth("");
    setSelectedStructureIds([]);
    setRemarks("");
    setActiveTab("student");
  };

  const handleAssign = () => {
    onAssign({ type: "individual", studentId: selectedStudentId, academicYear, month, structureIds: selectedStructureIds, remarks });
  };

  const goNext = () => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
  };

  const toggleStructure = (id: string) =>
    setSelectedStructureIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const clearStudent = () => {
    setSelectedStudentId(null);
    setStudentQuery("");
    setDebouncedQuery("");
    setTargetGradeId("all");
    setTargetSectionId("all");
  };

  // ─── Panel: Footer buttons ────────────────────────────────────────────────
  const PanelFooter = ({
    onBack, backLabel = "Back",
    onNext, nextLabel, nextDisabled = false,
  }: {
    onBack?: () => void; backLabel?: string;
    onNext?: () => void; nextLabel?: string; nextDisabled?: boolean;
  }) => (
    <div className="shrink-0 px-7 py-4 border-t border-slate-100 flex items-center gap-2 bg-white">
      {onBack && (
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          {backLabel}
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={cn(
            "ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            nextDisabled
              ? "bg-slate-100 text-slate-300 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          )}
        >
          {nextLabel} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );

  // ─── Panel content (plain JSX, NOT inner components) ──────────────────────
  // IMPORTANT: panels are rendered inline — never define them as React components
  // inside the render body, or inputs will lose focus on every keystroke.

  const renderStudentPanel = () => (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5 flex flex-col">
            <Label className="block w-full text-xs text-slate-500">Class</Label>
            <Select value={targetGradeId} onValueChange={setTargetGradeId}>
              <SelectTrigger className="w-full h-9 text-sm"><SelectValue placeholder="All Classes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {data.classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="block w-full text-xs text-slate-500">Section</Label>
            <Select value={targetSectionId} onValueChange={setTargetSectionId}>
              <SelectTrigger className="w-full h-9 text-sm"><SelectValue placeholder="All Sections" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {data.sections.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={studentQuery}
            onChange={(e) => setStudentQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="pl-9 h-10 text-sm"
          />
          {studentQuery && (
            <button onClick={() => { setStudentQuery(""); setDebouncedQuery(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {(debouncedQuery || targetGradeId !== "all" || targetSectionId !== "all") && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {isLoadingStudents ? (
              <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Searching...</span>
              </div>
            ) : students.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No students found</p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto bg-white">
                {students.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50/50 transition-colors text-left group",
                      selectedStudentId === s.id && "bg-green-50 border-l-2 border-green-600"
                    )}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={getPhotoUrl(s.photo) || ""} alt={s.fullName} />
                      <AvatarFallback className="bg-slate-200 text-slate-600 text-xs font-bold">
                        {s.fullName?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{s.fullName}</p>
                      <p className="text-xs text-slate-400">{s.gradeName} · {s.sectionName} · Roll {s.rollNo ?? "N/A"}</p>
                    </div>
                    {selectedStudentId === s.id
                      ? <Check size={14} className="text-green-600 shrink-0" />
                      : <ChevronRight size={14} className="text-slate-300 group-hover:text-green-500 shrink-0" />
                    }
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedStudent && (
        <PanelFooter
          onBack={clearStudent}
          backLabel="Clear"
          onNext={goNext}
          nextLabel="Continue to Fees"
        />
      )}
    </div>
  );

  const renderDetailsPanel = () => (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label className="block w-full text-xs text-slate-500 font-semibold uppercase tracking-wider">Academic Year</Label>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger className="w-full h-10 text-sm"><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {data.academicYears.map((y) => <SelectItem key={y.id} value={y.name}>{y.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="block w-full text-xs text-slate-500 font-semibold uppercase tracking-wider">Billing Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full h-10 text-sm"><SelectValue placeholder="Select month" /></SelectTrigger>
              <SelectContent>
                {data.months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fee Items</h4>
          {structureOptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <BookOpen size={22} className="text-slate-300" />
              <p className="text-sm text-slate-400 text-center">
                {!academicYear ? "Select an academic year first" : "No fee structures for this class"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {structureOptions.map((option) => {
                const isSelected = selectedStructureIds.includes(option.id.toString());
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleStructure(option.id.toString())}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all",
                      isSelected
                        ? "bg-green-50 border-green-500"
                        : "bg-white border-slate-200 hover:border-green-200 hover:bg-green-50/20"
                    )}
                  >
                    <div className={cn(
                      "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                      isSelected ? "bg-green-600 border-green-600" : "border-slate-300"
                    )}>
                      {isSelected && <Check size={9} className="text-white" strokeWidth={4} />}
                    </div>
                    <span className={cn("flex-1 text-sm font-medium", isSelected ? "text-green-900" : "text-slate-700")}>
                      {option.feeHead}
                    </span>
                    <span className={cn("text-sm font-bold tabular-nums", isSelected ? "text-green-700" : "text-slate-700")}>
                      Rs. {option.amount.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {selectedStructureIds.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">{selectedStructureIds.length} item{selectedStructureIds.length !== 1 ? "s" : ""}</span>
              <span className="text-sm font-bold text-slate-800 tabular-nums">Rs. {totalAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <PanelFooter
        onBack={() => setActiveTab("student")}
        onNext={goNext}
        nextLabel="Continue to Discounts"
        nextDisabled={!academicYear || !month || selectedStructureIds.length === 0}
      />
    </div>
  );

  const renderDiscountPanel = () => (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Discount Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col">
              <Label className="block w-full text-xs text-slate-500 font-semibold uppercase tracking-wider">Fee Head</Label>
              <Select
                value={discountFormData.feeHeadId?.toString() || ""}
                onValueChange={(val) => setDiscountFormData({ ...discountFormData, feeHeadId: Number(val) })}
              >
                <SelectTrigger className="w-full h-10 text-sm">
                  <SelectValue placeholder="Select Fee Head" />
                </SelectTrigger>
                <SelectContent>
                  {feeHeads.map((f: any) => (
                    <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="block w-full text-xs text-slate-500 font-semibold uppercase tracking-wider">Academic Year</Label>
              <Select
                value={discountFormData.academicYearId?.toString() || ""}
                onValueChange={(val) => setDiscountFormData({ ...discountFormData, academicYearId: Number(val) })}
              >
                <SelectTrigger className="w-full h-10 text-sm">
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {data.academicYears.map((y: any) => (
                    <SelectItem key={y.id} value={y.id.toString()}>{y.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="block w-full text-xs text-slate-500 font-semibold uppercase tracking-wider">
                {discountFormData.isPercentage ? "Discount Percentage (%)" : "Discount Value (Rs.)"}
              </Label>
              <Input
                type="number"
                value={discountFormData.discountValue || ""}
                onChange={(e) => {
                  let val = Number(e.target.value);
                  if (discountFormData.isPercentage && val > 100) val = 100;
                  if (val < 0) val = 0;
                  setDiscountFormData({ ...discountFormData, discountValue: val });
                }}
                placeholder={discountFormData.isPercentage ? "Percentage (0-100)" : "Amount in Rs."}
                max={discountFormData.isPercentage ? 100 : undefined}
                min={0}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="block w-full text-xs text-slate-500 font-semibold uppercase tracking-wider">Valid From</Label>
              <Input
                type="date"
                value={discountFormData.validFrom}
                onChange={(e) => setDiscountFormData({ ...discountFormData, validFrom: e.target.value })}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="block w-full text-xs text-slate-500 font-semibold uppercase tracking-wider">Valid To</Label>
              <Input
                type="date"
                value={discountFormData.validTo}
                onChange={(e) => setDiscountFormData({ ...discountFormData, validTo: e.target.value })}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-center">
              <Label className="block w-full text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Percentage Based</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="isPercentage"
                  checked={discountFormData.isPercentage}
                  onCheckedChange={(checked) => {
                    const newDiscountValue = checked && discountFormData.discountValue! > 100
                      ? 100
                      : discountFormData.discountValue;
                    setDiscountFormData({
                      ...discountFormData,
                      isPercentage: checked,
                      discountValue: newDiscountValue
                    });
                  }}
                />
                <span className="text-sm font-medium text-slate-700">{discountFormData.isPercentage ? "Yes (%)" : "No (Rs.)"}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleCreateDiscount}
              disabled={createDiscountMutation.isPending || !discountFormData.feeHeadId || !discountFormData.academicYearId}
              className="bg-green-600 hover:bg-green-700 h-10 rounded-xl px-6 text-sm font-bold shadow-sm shadow-green-100"
            >
              {createDiscountMutation.isPending ? "Applying..." : "Apply Discount"}
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Discounts</h4>
            <p className="text-xs text-slate-500 mt-1">Currently assigned concessions for this student</p>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <CustomTable
              columns={discountColumns(
                () => {},
                () => {}
              ).filter(col => col.key !== "actions")}
              data={studentDiscounts}
              isLoading={isLoadingDiscounts}
              caption="Student discounts list"
            />
          </div>
        </div>
      </div>

      <PanelFooter
        onBack={() => setActiveTab("details")}
        onNext={goNext}
        nextLabel="Continue to Remarks"
      />
    </div>
  );

  // ⚠ Remarks panel rendered inline (not as a sub-component) to prevent
  //   textarea from remounting and losing focus on every keystroke.
  const renderRemarksPanel = () => (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-3">
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 focus:bg-white transition-all resize-none"
          placeholder="Add an optional note about this fee assignment..."
        />
        <p className="text-xs text-slate-400">Optional — leave blank if not needed.</p>
      </div>

      <PanelFooter onBack={() => setActiveTab("discount")} />
    </div>
  );

  const panelMap: Record<string, () => JSX.Element> = {
    student: renderStudentPanel,
    details: renderDetailsPanel,
    discount: renderDiscountPanel,
    remarks: renderRemarksPanel,
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

      {/* Single container with vertical tabs */}
      <div className="xl:col-span-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex" style={{ minHeight: 560 }}>

          {/* Tab rail */}
          <div className="w-44 shrink-0 border-r border-slate-100 bg-slate-50/70 flex flex-col py-3">
            {TABS.map((tab) => {
              const done = tabDone[tab.id];
              const enabled = tabEnabled[tab.id];
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  disabled={!enabled}
                  onClick={() => enabled && setActiveTab(tab.id)}
                  className={cn(
                    "relative w-full flex items-center gap-2.5 px-4 py-3 text-left transition-all",
                    active ? "bg-white"
                      : enabled ? "hover:bg-white/60"
                        : "cursor-not-allowed"
                  )}
                >
                  {active && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-green-600" />}

                  <span className={cn(
                    "h-6 w-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold transition-all",
                    done && !active ? "bg-green-100 text-green-700"
                      : active ? "bg-green-600 text-white"
                        : enabled ? "bg-slate-200 text-slate-500"
                          : "bg-slate-100 text-slate-300"
                  )}>
                    {done && !active ? <Check size={11} strokeWidth={3} /> : tab.step}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-semibold truncate leading-tight",
                      active ? "text-green-700"
                        : enabled ? "text-slate-600"
                          : "text-slate-300"
                    )}>
                      {tab.label}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                      {tab.id === "student" && (selectedStudent ? selectedStudent.fullName.split(" ")[0] : "Not selected")}
                      {tab.id === "details" && (academicYear && month ? month : "Not set")}
                      {tab.id === "remarks" && (remarks ? "Added" : "Optional")}
                    </p>
                  </div>
                </button>
              );
            })}

            <div className="mt-auto px-4 pb-4 pt-3 border-t border-slate-100">
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors py-1"
              >
                <RotateCcw size={11} /> Reset all
              </button>
            </div>
          </div>

          {/* Panel area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-7 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-sm font-bold text-slate-900">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{panelSubtitles[activeTab]}</p>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {panelMap[activeTab]()}
            </div>
          </div>
        </div>
      </div>

      {/* Preview sidebar */}
      <div className="xl:col-span-4">
        <AssignmentPreview
          title="Individual Assignment"
          type="individual"
          targetName={selectedStudent?.fullName || ""}
          subDetails={[
            { label: "Month", value: month || "-" },
            { label: "Academic Year", value: academicYear || "-" },
          ]}
          selectedStructures={selectedStructures}
          totalAmount={totalAmount}
          onAssign={handleAssign}
          canAssign={!!canAssign}
          student={selectedStudent}
          onDeselect={() => { setSelectedStudentId(null); setStudentQuery(""); }}
        />
      </div>
    </div>
  );
}