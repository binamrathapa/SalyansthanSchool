"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";

export interface Teacher {
  photo?: string;
  name: string;
  subject: string;
  qualification: string;
  designation: string;
  experience: string;
  dob: string;
  joiningDate: string;
  address: string;
  contact: string;
  panNumber: string;
  nidNumber?: string;
  citizenshipNumber: string;
  gender: "Male" | "Female" | "Other";
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
export const teacherColumns = (
  onView: (teacher: Teacher) => void,
  onEdit: (teacher: Teacher) => void,
  onDelete: (teacher: Teacher) => void
): Column<Teacher>[] => [
  {
    key: "sn",
    label: "SN",
    className: "w-16",
    exportable:false,
  },
  { key: "photo", label: "Photo", className: "w-[80px]", exportable: false },
  { key: "name", label: "Name", exportable: true },
  { key: "subject", label: "Subject", exportable: true },
  { key: "qualification", label: "Qualification", exportable: true },
  { key: "designation", label: "Designation", exportable: true },
  { key: "contact", label: "Contact", exportable: true },
  { key: "gender", label: "Gender", exportable: true },
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

