"use client";

import { useState, useMemo } from "react";
import { CalendarDays, Filter, Receipt } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AssignmentPreview from "./shared/AssignmentPreview";
import { AssignmentData } from "../types";

interface BillGenerationProps {
  data: AssignmentData;
  onGenerate: (payload: any) => void;
}

const moneyFormatter = (amount: number) => `Rs. ${amount.toLocaleString()}`;

export default function BillGeneration({ data, onGenerate }: BillGenerationProps) {
  const [academicYear, setAcademicYear] = useState("");
  const [month, setMonth] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const [targetSection, setTargetSection] = useState("");

  const targetCount = useMemo(() => {
    return data.students.filter((student) => {
      const classMatched = targetClass ? student.class === targetClass : true;
      const sectionMatched = targetSection ? student.section === targetSection : true;
      return classMatched && sectionMatched;
    }).length;
  }, [targetClass, targetSection, data.students]);

  const handleGenerate = () => {
    onGenerate({
      type: "billing",
      academicYear,
      month,
      class: targetClass,
      section: targetSection,
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
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CalendarDays size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Billing Cycle</h3>
                <p className="text-sm text-slate-500">Specify the timing and scope for bill generation</p>
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
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Filter size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Define Scope</h3>
                <p className="text-sm text-slate-500">Filter students for bill generation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={targetClass} onValueChange={setTargetClass}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
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
                    <SelectValue placeholder="All sections" />
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
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 text-xs text-blue-700 leading-relaxed">
              <span className="font-bold uppercase tracking-wider block mb-1">Billing Note:</span>
              This action will generate official bills for all eligible students within the selected scope. Ensure that all standard and recurring fee assignments have been prepared correctly before proceeding.
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="xl:col-span-4 h-full">
        <AssignmentPreview
          title="Bill Generation"
          type="billing"
          targetName={month ? `${month} Cycle` : "No Cycle Selected"}
          subDetails={[
            { label: "Class scope", value: targetClass || "All Classes" },
            { label: "Section scope", value: targetSection || "All Sections" },
            { label: "Target Student Count", value: String(targetCount) },
            { label: "Academic Year", value: academicYear || "-" },
          ]}
          selectedStructures={[]} // Not applicable for billing generation preview in this simplified UI
          totalAmount={0} // Not applicable for billing generation preview
          onAssign={handleGenerate}
        />
      </div>
    </div>
  );
}
