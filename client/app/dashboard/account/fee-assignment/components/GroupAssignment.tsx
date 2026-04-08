"use client";

import { useState, useMemo } from "react";
import { Users, Search, FileText, Check, ChevronDown } from "lucide-react";
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
import { AssignmentData, FeeStructure } from "../types";

interface GroupAssignmentProps {
  data: AssignmentData;
  onAssign: (payload: any) => void;
}

const moneyFormatter = (amount: number) => `Rs. ${amount.toLocaleString()}`;

export default function GroupAssignment({ data, onAssign }: GroupAssignmentProps) {
  const [academicYear, setAcademicYear] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const [targetSection, setTargetSection] = useState("");
  const [month, setMonth] = useState("");
  const [selectedStructureIds, setSelectedStructureIds] = useState<string[]>([]);

  const structureOptions = useMemo(() => {
    if (!academicYear || !targetClass) return [];
    return data.feeStructures.filter(
      (item) => item.academicYear === academicYear && item.class === targetClass
    );
  }, [academicYear, targetClass, data.feeStructures]);

  const selectedStructures = useMemo(() => {
    return data.feeStructures.filter((item) => selectedStructureIds.includes(item.id.toString()));
  }, [selectedStructureIds, data.feeStructures]);

  const perStudentAmount = useMemo(() => {
    return selectedStructures.reduce((sum, item) => sum + item.amount, 0);
  }, [selectedStructures]);

  const targetCount = useMemo(() => {
    return data.students.filter((student) => {
      const classMatched = targetClass ? student.class === targetClass : true;
      const sectionMatched = targetSection ? student.section === targetSection : true;
      return classMatched && sectionMatched;
    }).length;
  }, [targetClass, targetSection, data.students]);

  const totalValue = perStudentAmount * targetCount;

  const handleAssign = () => {
    onAssign({
      type: "group",
      academicYear,
      class: targetClass,
      section: targetSection,
      month,
      structureIds: selectedStructureIds,
      targetCount,
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form */}
      <div className="xl:col-span-8 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Define Group</h3>
                <p className="text-sm text-slate-500">Select class and section for group assignment</p>
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
                    {data.academicYears.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={targetClass} onValueChange={setTargetClass}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.classes.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={targetSection} onValueChange={setTargetSection}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {data.sections.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
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
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Fees</h3>
                <p className="text-sm text-slate-500">Specify the structures for this group</p>
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
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="xl:col-span-4 h-full">
        <AssignmentPreview
          title="Group Assignment"
          type="group"
          targetName={targetClass || "All Eligible"}
          subDetails={[
            { label: "Section", value: targetSection || "All Sections" },
            { label: "Eligible Students", value: String(targetCount) },
            { label: "Per Student", value: moneyFormatter(perStudentAmount) },
            { label: "Month", value: month || "-" },
            { label: "Academic Year", value: academicYear || "-" },
          ]}
          selectedStructures={selectedStructures}
          totalAmount={totalValue}
          onAssign={handleAssign}
        />
      </div>
    </div>
  );
}
