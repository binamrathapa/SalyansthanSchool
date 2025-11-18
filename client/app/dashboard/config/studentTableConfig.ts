

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";

export interface Student {
  photo: string;
  name: string;
  grade: string;
  rollNo: string;
  parent: string;
  actions?: any;
}

export const studentColumns: Column<Student>[] = [
  { key: "sn", label: "S.N." },
  { key: "photo", label: "Photo", className: "w-[80px]" },
  { key: "name", label: "Name" },
  { key: "grade", label: "Grade" },
  { key: "rollNo", label: "Roll No" },
  { key: "parent", label: "Parent" },
  { key: "actions", label: "Actions", className: "text-right" },
];
