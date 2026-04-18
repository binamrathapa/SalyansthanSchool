import { useState, useMemo } from "react";
import { User, Search, FileText, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AssignmentPreview from "./shared/AssignmentPreview";
import { AssignmentData, Student, FeeStructure } from "../types";

interface IndividualAssignmentProps {
  data: AssignmentData;
  onAssign: (payload: any) => void;
}

export default function IndividualAssignment({ data, onAssign }: IndividualAssignmentProps) {
  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [academicYear, setAcademicYear] = useState("");
  const [month, setMonth] = useState("");
  const [selectedStructureIds, setSelectedStructureIds] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");

  const filteredStudents = useMemo(() => {
    const query = studentQuery.trim().toLowerCase();
    if (!query) return data.students.slice(0, 5); // Show first 5 initially

    return data.students.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.admission_no.toLowerCase().includes(query) ||
        s.class.toLowerCase().includes(query)
    );
  }, [studentQuery, data.students]);

  const selectedStudent = useMemo(() => {
    return data.students.find((s) => s.id === selectedStudentId);
  }, [selectedStudentId, data.students]);

  const structureOptions = useMemo(() => {
    if (!selectedStudent || !academicYear) return [];
    return data.feeStructures.filter(
      (item) => item.academicYear === academicYear && item.class === selectedStudent.class
    );
  }, [selectedStudent, academicYear, data.feeStructures]);

  const selectedStructures = useMemo(() => {
    return data.feeStructures.filter((item) => selectedStructureIds.includes(item.id.toString()));
  }, [selectedStructureIds, data.feeStructures]);

  const totalAmount = useMemo(() => {
    return selectedStructures.reduce((sum, item) => sum + item.amount, 0);
  }, [selectedStructures]);

  const handleAssign = () => {
    onAssign({
      type: "individual",
      studentId: selectedStudentId,
      academicYear,
      month,
      structureIds: selectedStructureIds,
      remarks,
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form */}
      <div className="xl:col-span-8 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Search size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Find Student</h3>
                <p className="text-sm text-slate-500">Search and select a student to assign fees</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="search-student">Search Student</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="search-student"
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                    placeholder="Name, admission no..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Student</Label>
                <Select
                  value={selectedStudentId?.toString() || ""}
                  onValueChange={(val) => setSelectedStudentId(Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name} ({s.admission_no}) - {s.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Assignment Details</h3>
                <p className="text-sm text-slate-500">Specify the cycle and structures</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.academicYears.map((y) => (
                      <SelectItem key={y.id} value={y.name}>
                        {y.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Billing Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fee Structures</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between font-normal",
                      !selectedStructureIds.length && "text-muted-foreground"
                    )}
                  >
                    {selectedStructureIds.length > 0
                      ? `${selectedStructureIds.length} structures selected`
                      : "Select fee structures..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search structures..." />
                    <CommandList>
                      <CommandEmpty>No structures found.</CommandEmpty>
                      <CommandGroup>
                        {structureOptions.map((option) => (
                          <CommandItem
                            key={option.id}
                            onSelect={() => {
                              const id = option.id.toString();
                              setSelectedStructureIds((prev) =>
                                prev.includes(id)
                                  ? prev.filter((i) => i !== id)
                                  : [...prev, id]
                              );
                            }}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Checkbox
                                checked={selectedStructureIds.includes(
                                  option.id.toString()
                                )}
                              />
                              <div className="flex flex-1 items-center justify-between">
                                <span>{option.feeHead}</span>
                                <span className="font-bold">
                                  Rs. {option.amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add an optional note..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="xl:col-span-4 h-full">
        <AssignmentPreview
          title="Individual Assignment"
          type="individual"
          targetName={selectedStudent?.name || ""}
          subDetails={[
            { label: "Admission No", value: selectedStudent?.admission_no || "-" },
            { label: "Class / Section", value: selectedStudent ? `${selectedStudent.class} - ${selectedStudent.section}` : "-" },
            { label: "Month", value: month || "-" },
            { label: "Academic Year", value: academicYear || "-" },
          ]}
          selectedStructures={selectedStructures}
          totalAmount={totalAmount}
          onAssign={handleAssign}
        />
      </div>
    </div>
  );
}
