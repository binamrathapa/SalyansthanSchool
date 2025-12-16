"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import TeacherScheduleCalendar from "./TeacherScheduleCalendar";
import { teacherScheduleData } from "@/app/dashboard/data/teacherScheduleData";
import { exportScheduleWithPreview } from "@/app/dashboard/utils/exportSchedulePDF";

export default function TeacherSchedulePage() {
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const classes = Array.from(
    new Set(teacherScheduleData.map((item) => item.className))
  );

  const filteredData =
    selectedClass === "all"
      ? teacherScheduleData
      : teacherScheduleData.filter((item) => item.className === selectedClass);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Teacher Schedule</h1>

      {/* Class Filter */}
      <div className=" flex items-center justify-end gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() =>
            exportScheduleWithPreview(filteredData, "Teacher Weekly Schedule")
          }
          className="flex items-center gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white transition-colors duration-200"
        >
          <Download className="w-5 h-5 text-white" /> Export PDF
        </Button> 
      </div>

      {/* Calendar */}
      <TeacherScheduleCalendar data={filteredData} />
    </div>
  );
}
