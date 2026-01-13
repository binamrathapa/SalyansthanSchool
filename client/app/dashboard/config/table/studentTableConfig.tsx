"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";

import { Student } from "@/app/dashboard/types/student";
import { getPhotoUrl } from "@/server-action/utils/api";

//MODAL FIELD TYPES 
export type ModalFieldType = "text" | "image" | "date" | "phone";

export interface ModalField<T> {
  label: string;
  key: keyof T;
  type: ModalFieldType;
  icon?: React.ReactNode;
  className?: string;
}

//STUDENT TABLE COLUMNS
export const studentColumns = (
  onView: (student: Student) => void,
  onEdit: (student: Student) => void,
  onDelete: (student: Student) => void
): Column<Student>[] => [
  {
    key: "sn",
    label: "SN",
    exportable: false,
  },
  {
    key: "photo",
    label: "Photo",
    exportable: false,
    render: (row) =>
      row.photo ? (
        <img
        src={getPhotoUrl(row.photo)}
        alt={row.fullName}
        className="w-12 h-12 rounded-full object-cover"
      />
      ) : null,
  },
  { key: "fullName", label: "Full Name" },
  { key: "guardianName", label: "Guardian Name" },
  { key: "gradeName", label: "Grade" },
  {
    key: "actions",
    label: "Actions",
    exportable: false,
    render: (row) => (
      <div className="flex gap-2 justify-end">
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
