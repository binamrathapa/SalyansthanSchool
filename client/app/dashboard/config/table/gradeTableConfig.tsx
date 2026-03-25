"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Grade } from "@/app/dashboard/types/grade";


// TABLE CONFIG
export const gradeColumns = (
  // onEdit: (grade: Grade) => void,
  onDelete: (grade: Grade) => void
): Column<Grade>[] => [
  {
    key: "sn",
    label: "SN",
    visible: true,
    exportable: false,
    render: (_, index) => index + 1, 
  },
  {
    key: "name",
    label: "Grade",
    visible: true,
    exportable: true,
  },
 {
  key: "sections",
  label: "Section(s)",
  visible: true,
  exportable: true,
  render: (row) => (
    <div className="flex flex-wrap gap-1">
      {row.sections.map((section) => (
        <span
          key={section.id}
          className="px-2 py-1 bg-gray-100 rounded text-sm"
        >
          {section.name}
        </span>
      ))}
    </div>
  ),
},
  {
    key: "actions",
    label: "Actions",
    visible: true,
    exportable: false,
    render: (row) => (
      <div className="flex gap-2">
        {/* <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
          <Edit className="w-4 h-4" />
        </Button> */}
        <Button size="sm" variant="destructive" onClick={() => onDelete(row)}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
