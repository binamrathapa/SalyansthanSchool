

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
  { key: "photo", label: "Photo", className: "w-[80px]", exportable: false }, 
  { key: "name", label: "Name", exportable: true },
  { key: "grade", label: "Grade", exportable: true },
  { key: "rollNo", label: "Roll No", exportable: true },
  { key: "parent", label: "Parent", exportable: true },
  { key: "actions", label: "Actions", className: "text-right", exportable: false }, //Don't export
];

