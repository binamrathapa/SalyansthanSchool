"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";

export interface Student {
  photo: string;
  name: string;
  grade: string;
  rollNo: string;
  dob: string;
  admissionDate: string;
  address: string;
  contact: string;
  parentContact: string;
  parent: string;
  gender: string;
}

export type ModalFieldType = "text" | "image" | "date" | "phone";

export interface ModalField<T> {
  label: string;
  key: keyof T;
  type: ModalFieldType;
  icon?: React.ReactNode;
  className?: string;
}

// Columns for table
export const studentColumns = (
  onView: (student: Student) => void,
  onEdit: (student: Student) => void,
  onDelete: (student: Student) => void
): Column<Student>[] => [
  {
    key: "sn",
    label: "SN",
    className: "w-16 ",
    exportable: false,
  },
  { key: "photo", label: "Photo", className: "w-[80px]", exportable: false },
  { key: "name", label: "Name", exportable: true },
  { key: "grade", label: "Grade", exportable: true },
  { key: "rollNo", label: "Roll No", exportable: true },
  { key: "parent", label: "Parent", exportable: true },
  {
    key: "actions",
    label: "Actions",
    className: "text-right",
    exportable: false,
    render: (row) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => onView(row)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(row)}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

