"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { Teacher } from "../../types/teacher";
import { getPhotoUrl } from "@/server-action/utils/api";

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
  {
    key: "photo",
    label: "Photo",
    className: "w-[80px]",
    exportable: false,
    render: (row) =>
      row.photo ? (
        <img
          src={getPhotoUrl(row.photo)}
          alt={row.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
          No
        </div>
      ),
  },
  { key: "employeeCode", label: "Code", exportable: true },
  { key: "fullName", label: "Full Name", exportable: true },
  { key: "email", label: "Email", exportable: true },
  { key: "mobileNo", label: "Mobile No", exportable: true },
  { key: "qualification", label: "Qualification", exportable: true },
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

