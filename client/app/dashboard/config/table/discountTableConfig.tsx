"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Trash, ToggleLeft, ToggleRight } from "lucide-react";
import { StudentDiscount } from "@/app/dashboard/types/discount";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const discountColumns = (
  onDelete: (row: StudentDiscount) => void,
  onToggle: (row: StudentDiscount) => void
): Column<StudentDiscount>[] => [
  {
    key: "sn",
    label: "SN",
    visible: true,
    exportable: false,
  },
  {
    key: "studentName",
    label: "Student",
    visible: true,
    exportable: true,
  },
  {
    key: "feeHeadName",
    label: "Fee Head",
    visible: true,
    exportable: true,
  },
  {
    key: "academicYearName",
    label: "Academic Year",
    visible: true,
    exportable: true,
  },
  {
    key: "discountAmount",
    label: "Discount",
    visible: true,
    exportable: true,
    render: (row) => `Rs. ${row.discountAmount}`,
  },
  {
    key: "validFrom",
    label: "Valid From",
    visible: true,
    exportable: true,
    render: (row) => new Date(row.validFrom).toLocaleDateString(),
  },
  {
    key: "validTo",
    label: "Valid To",
    visible: true,
    exportable: true,
    render: (row) => new Date(row.validTo).toLocaleDateString(),
  },
  {
    key: "isActive",
    label: "Status",
    visible: true,
    exportable: true,
    render: (row) => (
      <Badge variant={row.isActive ? "default" : "secondary"}>
        {row.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    visible: true,
    exportable: false,
    render: (row) => (
      <div className="flex gap-2 whitespace-nowrap">
        <Button
          size="sm"
          variant="outline"
          title={row.isActive ? "Deactivate" : "Activate"}
          onClick={() => onToggle(row)}
        >
          {row.isActive ? (
            <ToggleRight className="w-4 h-4 text-green-600" />
          ) : (
            <ToggleLeft className="w-4 h-4 text-green-400" />
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(row)}>
          <Trash className="w-4 h-4 text-green-600" />
        </Button>
      </div>
    ),
  },
];
