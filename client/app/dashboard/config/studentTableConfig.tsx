"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, Calendar, User, Phone, MapPin } from "lucide-react";

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

// Modal fields with icons
export const studentModalFields: ModalField<Student>[] = [
  { label: "Photo", key: "photo", type: "image", className: "md:col-span-2" },
  {
    label: "Name",
    key: "name",
    type: "text",
    icon: <User className="w-4 h-4" />,
  },
  {
    label: "Grade",
    key: "grade",
    type: "text",
    icon: <User className="w-4 h-4" />,
  },
  {
    label: "Roll Number",
    key: "rollNo",
    type: "text",
    icon: <User className="w-4 h-4" />,
  },
  {
    label: "Parent/Guardian",
    key: "parent",
    type: "text",
    icon: <User className="w-4 h-4" />,
  },
  {
    label: "Date of Birth",
    key: "dob",
    type: "date",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    label: "Admission Date",
    key: "admissionDate",
    type: "date",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    label: "Address",
    key: "address",
    type: "text",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    label: "Contact Number",
    key: "contact",
    type: "phone",
    icon: <Phone className="w-4 h-4" />,
  },
  {
    label: "Parent Contact Number",
    key: "parentContact",
    type: "phone",
    icon: <Phone className="w-4 h-4" />,
  },
  {
    label: "Gender",
    key: "gender",
    type: "text",
    icon: <User className="w-4 h-4" />,
  },
];
