"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Section } from "@/app/dashboard/types/grade";

export const sectionColumns = (
  onEdit: (section: Section) => void,
  onDelete: (section: Section) => void
): Column<Section>[] => [
  {
    key: "sn",
    label: "SN",
    visible: true,
    exportable: false,
    render: (_, index) => index + 1,
  },
  {
    key: "name",
    label: "Section Name",
    visible: true,
    exportable: true,
  },
  {
    key: "actions",
    label: "Actions",
    visible: true,
    exportable: false,
    render: (row) => (
      <div className="flex gap-2">
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
