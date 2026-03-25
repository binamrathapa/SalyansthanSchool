"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  User,
  Users,
  CalendarDays,
  PlusCircle,
  CheckCircle2,
  FileSpreadsheet,
  Layers3,
  Search,
  ChevronDown,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CustomTable, {
  Column,
} from "@/app/dashboard/components/dashboard/common/CustomTable";
import assignmentData from "./fee-assignment-data.json";

/* ------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------ */

interface AcademicYear {
  id: number;
  name: string;
}

interface ClassItem {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  admission_no: string;
  class: string;
  section: string;
  roll_no: number;
}

interface FeeStructure {
  id: number;
  academicYear: string;
  class: string;
  feeHead: string;
  amount: number;
  type: string;
}

interface RecentAssignment {
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

interface AssignmentData {
  academicYears: AcademicYear[];
  classes: ClassItem[];
  sections: Section[];
  students: Student[];
  feeStructures: FeeStructure[];
  months: string[];
  recentAssignments: RecentAssignment[];
}

/* ------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------ */

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
    >
      <option value="">{placeholder || `Select ${label}`}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  </div>
);

const SectionCard = ({
  icon,
  title,
  sub,
  children,
}: {
  icon: React.ElementType;
  title: string;
  sub: string;
  children: React.ReactNode;
}) => {
  const Icon = icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const PreviewRow = ({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className={strong ? "font-bold text-slate-900" : "font-medium text-slate-700"}>
      {value}
    </span>
  </div>
);

const MultiSelectDropdown = ({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = "Select options",
}: {
  label: string;
  options: FeeStructure[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedOptions = options.filter((item) =>
    selectedIds.includes(item.id.toString())
  );

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const displayText =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length === 1
      ? `${selectedOptions[0].feeHead} - ${money(selectedOptions[0].amount)}`
      : `${selectedOptions.length} fee structures selected`;

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white flex items-center justify-between outline-none focus:ring-2 focus:ring-blue-200"
      >
        <span
          className={`truncate text-left ${
            selectedOptions.length === 0 ? "text-slate-400" : "text-slate-800"
          }`}
        >
          {displayText}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg max-h-72 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-4 text-sm text-slate-400">
              No fee structures available.
            </div>
          ) : (
            <div className="py-2">
              {options.map((item) => {
                const checked = selectedIds.includes(item.id.toString());

                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 ${
                      checked ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOption(item.id.toString())}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {item.feeHead}
                        </p>
                        <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                          {money(item.amount)}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.type} • {item.class} • {item.academicYear}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------ */
/* PAGE */
/* ------------------------------------------------ */

export default function FeeAssignmentPage() {
  const data = assignmentData as AssignmentData;
  const [activeTab, setActiveTab] = useState("individual");

  /* ---------------- Individual Assignment ---------------- */
  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [individualAcademicYear, setIndividualAcademicYear] = useState("");
  const [individualMonth, setIndividualMonth] = useState("");
  const [selectedIndividualStructureIds, setSelectedIndividualStructureIds] = useState<string[]>([]);
  const [individualRemarks, setIndividualRemarks] = useState("");

  /* ---------------- Group Assignment ---------------- */
  const [groupAcademicYear, setGroupAcademicYear] = useState("");
  const [groupClass, setGroupClass] = useState("");
  const [groupSection, setGroupSection] = useState("");
  const [groupMonth, setGroupMonth] = useState("");
  const [selectedGroupStructureIds, setSelectedGroupStructureIds] = useState<string[]>([]);

  /* ---------------- Bill Generation ---------------- */
  const [generationAcademicYear, setGenerationAcademicYear] = useState("");
  const [generationMonth, setGenerationMonth] = useState("");
  const [generationClass, setGenerationClass] = useState("");
  const [generationSection, setGenerationSection] = useState("");

  /* ---------------- Derived Data ---------------- */
  const filteredStudents = useMemo(() => {
    const query = studentQuery.trim().toLowerCase();
    if (!query) return data.students;

    return data.students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.admission_no.toLowerCase().includes(query) ||
        student.class.toLowerCase().includes(query) ||
        student.section.toLowerCase().includes(query)
    );
  }, [studentQuery, data.students]);

  const selectedStudent = useMemo(() => {
    return data.students.find((student) => student.name === selectedStudentName);
  }, [selectedStudentName, data.students]);

  const individualStructureOptions = useMemo(() => {
    if (!selectedStudent || !individualAcademicYear) return [];

    return data.feeStructures.filter(
      (item) =>
        item.academicYear === individualAcademicYear &&
        item.class === selectedStudent.class
    );
  }, [selectedStudent, individualAcademicYear, data.feeStructures]);

  const selectedIndividualStructures = useMemo(() => {
    return data.feeStructures.filter((item) =>
      selectedIndividualStructureIds.includes(item.id.toString())
    );
  }, [selectedIndividualStructureIds, data.feeStructures]);

  const individualTotalAmount = useMemo(() => {
    return selectedIndividualStructures.reduce((sum, item) => sum + item.amount, 0);
  }, [selectedIndividualStructures]);

  const groupStructureOptions = useMemo(() => {
    if (!groupAcademicYear || !groupClass) return [];

    return data.feeStructures.filter(
      (item) =>
        item.academicYear === groupAcademicYear &&
        item.class === groupClass
    );
  }, [groupAcademicYear, groupClass, data.feeStructures]);

  const selectedGroupStructures = useMemo(() => {
    return data.feeStructures.filter((item) =>
      selectedGroupStructureIds.includes(item.id.toString())
    );
  }, [selectedGroupStructureIds, data.feeStructures]);

  const groupPerStudentAmount = useMemo(() => {
    return selectedGroupStructures.reduce((sum, item) => sum + item.amount, 0);
  }, [selectedGroupStructures]);

  const groupTargetCount = useMemo(() => {
    return data.students.filter((student) => {
      const classMatched = groupClass ? student.class === groupClass : true;
      const sectionMatched = groupSection ? student.section === groupSection : true;
      return classMatched && sectionMatched;
    }).length;
  }, [groupClass, groupSection, data.students]);

  const groupTotalValue = useMemo(() => {
    return groupPerStudentAmount * groupTargetCount;
  }, [groupPerStudentAmount, groupTargetCount]);

  const generationTargetCount = useMemo(() => {
    return data.students.filter((student) => {
      const classMatched = generationClass ? student.class === generationClass : true;
      const sectionMatched = generationSection
        ? student.section === generationSection
        : true;
      return classMatched && sectionMatched;
    }).length;
  }, [generationClass, generationSection, data.students]);

  /* ---------------- Actions ---------------- */
  const handleIndividualAssign = () => {
    console.log("Assign fee structures to student", {
      student: selectedStudentName,
      academicYear: individualAcademicYear,
      month: individualMonth,
      feeStructureIds: selectedIndividualStructureIds,
      remarks: individualRemarks,
    });
  };

  const handleGroupAssign = () => {
    console.log("Assign fee structures to group", {
      academicYear: groupAcademicYear,
      class: groupClass,
      section: groupSection,
      month: groupMonth,
      feeStructureIds: selectedGroupStructureIds,
      targetCount: groupTargetCount,
    });
  };

  const handleGenerateBills = () => {
    console.log("Generate bills", {
      academicYear: generationAcademicYear,
      month: generationMonth,
      class: generationClass,
      section: generationSection,
      targetCount: generationTargetCount,
    });
  };

  /* ---------------- Table ---------------- */
  const assignmentColumns: Column<RecentAssignment>[] = [
    { key: "sn", label: "S.N.", visible: true, exportable: true },
    { key: "targetType", label: "Target Type", visible: true, exportable: true },
    { key: "targetName", label: "Target", visible: true, exportable: true },
    { key: "class", label: "Class", visible: true, exportable: true },
    { key: "section", label: "Section", visible: true, exportable: true },
    { key: "feeHead", label: "Fee Head", visible: true, exportable: true },
    {
      key: "amount",
      label: "Amount",
      visible: true,
      exportable: true,
      render: (row) => money(row.amount),
    },
    { key: "type", label: "Type", visible: true, exportable: true },
    { key: "month", label: "Month", visible: true, exportable: true },
    { key: "academicYear", label: "Academic Year", visible: true, exportable: true },
    { key: "assignedOn", label: "Assigned On", visible: true, exportable: true },
  ];

  return (
    <div className="p-6 md:p-7 bg-slate-100 min-h-screen space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Fee Assignment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select one or multiple existing fee structures from dropdown and assign them to students, classes, or sections.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Assignments
          </Button>
          <Button
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
            onClick={() => setActiveTab("individual")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Assign Fee
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <span className="font-semibold">Workflow:</span> Fee Structure defines amount and type. This page selects which structures to assign and to whom. Payment happens in Fee Collection.
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border border-slate-200 rounded-2xl p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger
            value="individual"
            className="rounded-xl px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Individual Assignment
          </TabsTrigger>
          <TabsTrigger
            value="group"
            className="rounded-xl px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Class / Section Assignment
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-xl px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Bill Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-6">
          <SectionCard
            icon={User}
            title="Assign Fee Structures to Student"
            sub="Select multiple fee structures from dropdown and assign them to an individual student."
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                <InputField
                  label="Search Student"
                  value={studentQuery}
                  onChange={setStudentQuery}
                  placeholder="Search by name, admission no, class, section..."
                />

                <SelectField
                  label="Student"
                  value={selectedStudentName}
                  onChange={setSelectedStudentName}
                  options={filteredStudents.map((student) => student.name)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Academic Year"
                    value={individualAcademicYear}
                    onChange={setIndividualAcademicYear}
                    options={data.academicYears.map((item) => item.name)}
                  />

                  <SelectField
                    label="Billing Month"
                    value={individualMonth}
                    onChange={setIndividualMonth}
                    options={data.months}
                  />
                </div>

                <MultiSelectDropdown
                  label="Fee Structures"
                  options={individualStructureOptions}
                  selectedIds={selectedIndividualStructureIds}
                  onChange={setSelectedIndividualStructureIds}
                  placeholder="Select fee structures"
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Remarks
                  </label>
                  <textarea
                    value={individualRemarks}
                    onChange={(e) => setIndividualRemarks(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Optional note..."
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <h4 className="font-semibold text-slate-900">Assignment Preview</h4>

                <PreviewRow label="Student" value={selectedStudent?.name || "-"} />
                <PreviewRow
                  label="Admission No"
                  value={selectedStudent?.admission_no || "-"}
                />
                <PreviewRow
                  label="Class / Section"
                  value={
                    selectedStudent
                      ? `${selectedStudent.class} - ${selectedStudent.section}`
                      : "-"
                  }
                />
                <PreviewRow
                  label="Selected Structures"
                  value={String(selectedIndividualStructures.length)}
                />
                <PreviewRow
                  label="Total Amount"
                  value={money(individualTotalAmount)}
                  strong
                />

                <div className="pt-2 space-y-2">
                  {selectedIndividualStructures.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-white border border-slate-200 px-3 py-2"
                    >
                      <div className="flex justify-between gap-2">
                        <span className="text-sm font-medium text-slate-800">
                          {item.feeHead}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {money(item.amount)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.type}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleIndividualAssign}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  <User className="h-4 w-4 mr-2" />
                  Assign to Student
                </Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="group" className="mt-6">
          <SectionCard
            icon={Users}
            title="Assign Fee Structures to Class / Section"
            sub="Select multiple fee structures from dropdown and assign them to all students in a class or section."
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Academic Year"
                    value={groupAcademicYear}
                    onChange={setGroupAcademicYear}
                    options={data.academicYears.map((item) => item.name)}
                  />

                  <SelectField
                    label="Billing Month"
                    value={groupMonth}
                    onChange={setGroupMonth}
                    options={data.months}
                  />

                  <SelectField
                    label="Class"
                    value={groupClass}
                    onChange={setGroupClass}
                    options={data.classes.map((item) => item.name)}
                  />

                  <SelectField
                    label="Section"
                    value={groupSection}
                    onChange={setGroupSection}
                    options={data.sections.map((item) => item.name)}
                    placeholder="All Sections"
                  />
                </div>

                <MultiSelectDropdown
                  label="Fee Structures"
                  options={groupStructureOptions}
                  selectedIds={selectedGroupStructureIds}
                  onChange={setSelectedGroupStructureIds}
                  placeholder="Select fee structures"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <h4 className="font-semibold text-slate-900">Group Preview</h4>

                <PreviewRow label="Class" value={groupClass || "-"} />
                <PreviewRow label="Section" value={groupSection || "All"} />
                <PreviewRow label="Target Students" value={String(groupTargetCount)} />
                <PreviewRow
                  label="Selected Structures"
                  value={String(selectedGroupStructures.length)}
                />
                <PreviewRow
                  label="Amount / Student"
                  value={money(groupPerStudentAmount)}
                />
                <PreviewRow
                  label="Total Assignment Value"
                  value={money(groupTotalValue)}
                  strong
                />

                <div className="pt-2 space-y-2">
                  {selectedGroupStructures.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-white border border-slate-200 px-3 py-2"
                    >
                      <div className="flex justify-between gap-2">
                        <span className="text-sm font-medium text-slate-800">
                          {item.feeHead}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {money(item.amount)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.type}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleGroupAssign}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Assign to Group
                </Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <SectionCard
            icon={CalendarDays}
            title="Generate Bills"
            sub="Generate actual student billing entries after assignment is prepared for the selected billing cycle."
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Academic Year"
                  value={generationAcademicYear}
                  onChange={setGenerationAcademicYear}
                  options={data.academicYears.map((item) => item.name)}
                />

                <SelectField
                  label="Billing Month"
                  value={generationMonth}
                  onChange={setGenerationMonth}
                  options={data.months}
                />

                <SelectField
                  label="Class"
                  value={generationClass}
                  onChange={setGenerationClass}
                  options={data.classes.map((item) => item.name)}
                />

                <SelectField
                  label="Section"
                  value={generationSection}
                  onChange={setGenerationSection}
                  options={data.sections.map((item) => item.name)}
                  placeholder="All Sections"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <h4 className="font-semibold text-slate-900">Bill Generation Preview</h4>

                <PreviewRow
                  label="Academic Year"
                  value={generationAcademicYear || "-"}
                />
                <PreviewRow
                  label="Month"
                  value={generationMonth || "-"}
                />
                <PreviewRow
                  label="Class"
                  value={generationClass || "All Eligible"}
                />
                <PreviewRow
                  label="Section"
                  value={generationSection || "All"}
                />
                <PreviewRow
                  label="Students to Bill"
                  value={String(generationTargetCount)}
                  strong
                />

                <Button
                  onClick={handleGenerateBills}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Generate Bills
                </Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Recent Fee Assignments
            </h3>
            <p className="text-sm text-slate-500">
              Latest assigned fee structures for student or group targets
            </p>
          </div>

          <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
            <Layers3 size={20} />
          </div>
        </div>

        <CustomTable<RecentAssignment>
          caption="Recent fee assignments"
          data={data.recentAssignments}
          columns={assignmentColumns}
          limit={10}
          searchableKeys={[
            "targetType",
            "targetName",
            "class",
            "section",
            "feeHead",
            "month",
            "academicYear",
          ]}
          filterOptions={[
            { label: "Student", value: "Student", key: "targetType" },
            { label: "Class", value: "Class", key: "targetType" },
            { label: "Monthly", value: "Monthly", key: "type" },
            { label: "One Time", value: "One Time", key: "type" },
          ]}
        />
      </div>
    </div>
  );
}