"use client";

import { useState, useMemo } from "react";
import {
  User,
  Users,
  CalendarDays,
  PlusCircle,
  FileSpreadsheet,
  Info,
  TrendingUp,
  Clock
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess } from "@/lib/sweet-alert";

// New Components
import IndividualAssignment from "./components/IndividualAssignment";
import GroupAssignment from "./components/GroupAssignment";
import BillGeneration from "./components/BillGeneration";
import RecentAssignmentsTable from "./components/RecentAssignmentsTable";

import { useGetAllGrades } from "@/server-action/api/grade.api";
import { useGetAllSections } from "@/server-action/api/section.api";
import { useGetAllStudents } from "@/server-action/api/student.api";
import { useGetAllFeeStructures } from "@/server-action/api/fee-structure.api";
import { useGetAllAcademicYears } from "@/server-action/api/academic-year-api";

// Mock Data & Types
import assignmentData from "./fee-assignment-data.json";
import { AssignmentData } from "./types";


export default function FeeAssignmentPage() {
  const [activeTab, setActiveTab] = useState("individual");

  // Fetch real data from APIs
  const { data: gradesData, isLoading: isLoadingGrades } = useGetAllGrades();
  const { data: sectionsData, isLoading: isLoadingSections } = useGetAllSections();
  const { data: studentsData, isLoading: isLoadingStudents } = useGetAllStudents();
  const { data: feeStructuresData, isLoading: isLoadingStructures } = useGetAllFeeStructures();
  const { data: academicYearsData, isLoading: isLoadingYears } = useGetAllAcademicYears();

  const isLoading = isLoadingGrades || isLoadingSections || isLoadingStudents || isLoadingStructures || isLoadingYears;

  // Synthesize data for components
  const data: AssignmentData = useMemo(() => {
    return {
      academicYears: academicYearsData || [],
      classes: gradesData || [],
      sections: (sectionsData || []).map((s: any) => ({
        id: s.id,
        name: s.sectionName || s.name,
      })),
      students: (studentsData || []).map((s: any) => ({
        id: s.id,
        name: s.fullName || `${s.firstName} ${s.lastName}`,
        admission_no: s.admissionNo?.toString() || "-", // Example mapping if admission_no is missing
        class: s.gradeName || "Unknown",
        section: s.sectionName || "Unknown",
        roll_no: s.rollNo || "-",
      })),
      feeStructures: (feeStructuresData || []).map((fs: any) => ({
        id: fs.id,
        academicYear: fs.academicYearName || fs.academicYear?.name || "Unknown",
        class: fs.gradeName || fs.grade?.name || "Unknown",
        feeHead: fs.feeHeadName || fs.feeHead?.name || "Unknown",
        amount: fs.amount,
        type: fs.type || "Recurring",
      })),
      months: [
        "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
        "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
      ],
      recentAssignments: assignmentData.recentAssignments, // Keep mock for now
    };
  }, [academicYearsData, gradesData, sectionsData, studentsData, feeStructuresData]);

  const handleAssignment = (payload: any) => {
    console.log("Processing assignment:", payload);
    showSuccess(`${payload.type === "billing" ? "Billing cycle generated" : "Fees assigned"} successfully!`);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Synchronizing school data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Fee Assignment
          </h1>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
            Manage and distribute fee structures across your student base.
          </p>
        </div>

      </div>
      {/* Main Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <TabsList className="bg-white border border-slate-200 rounded-2xl p-1.5 h-auto">
            {[
              { value: "individual", label: "Individual", icon: User },
              { value: "group", label: "Class / Section", icon: Users },
              { value: "billing", label: "Generate Bills", icon: CalendarDays },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-xl px-6 py-2.5 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-200 transition-all font-bold text-sm flex items-center gap-2"
              >
                <tab.icon size={16} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="transition-all duration-300">
          <TabsContent value="individual" className="mt-0 focus-visible:outline-none">
            <IndividualAssignment data={data} onAssign={handleAssignment} />
          </TabsContent>

          <TabsContent value="group" className="mt-0 focus-visible:outline-none">
            <GroupAssignment data={data} onAssign={handleAssignment} />
          </TabsContent>

          <TabsContent value="billing" className="mt-0 focus-visible:outline-none">
            <BillGeneration data={data} onGenerate={handleAssignment} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Historical Data Section */}
      <div className="pt-8 border-t border-slate-200">
        <RecentAssignmentsTable data={data.recentAssignments} />
      </div>
    </div>
  );
}