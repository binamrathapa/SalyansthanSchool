"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { FeeCategory, FeeHead } from "@/app/dashboard/types/account";

/* ============================================================
   FEE CATEGORY TABLE COLUMNS
============================================================ */

export const feeCategoryColumns = (
  onEdit: (row: FeeCategory) => void,
  onDelete: (row: FeeCategory) => void
): Column<FeeCategory>[] => [
  {
    key: "sn",
    label: "SN",
    visible: true,
    exportable: false,
  },
  {
    key: "name",
    label: "Category Name",
    visible: true,
    exportable: true,
  },
  {
    key: "createdAt",
    label: "Date Created",
    visible: true,
    exportable: true,
    render: (row) =>
      new Date(row.createdAt).toLocaleDateString(),
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
          onClick={() => onEdit(row)}
        >
          <Edit className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

/* ============================================================
   FEE HEAD TABLE COLUMNS
============================================================ */

export const feeHeadColumns = (
  onEdit: (row: FeeHead) => void,
  onDelete: (row: FeeHead) => void
): Column<FeeHead>[] => [
  {
    key: "sn",
    label: "SN",
    visible: true,
    exportable: false,
  },
  {
    key: "name",
    label: "Account Head",
    visible: true,
    exportable: true,
  },
  {
    key: "feeCategoryName",
    label: "Category",
    visible: true,
    exportable: true,
  },
  {
    key: "createdAt",
    label: "Date Created",
    visible: true,
    exportable: true,
    render: (row) =>
      new Date(row.createdAt).toLocaleDateString(),
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
          onClick={() => onEdit(row)}
        >
          <Edit className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];