"use client";

import CustomTable, { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { RecentAssignment } from "../types";

interface RecentAssignmentsTableProps {
  data: RecentAssignment[];
}

const moneyFormatter = (amount: number) => `Rs. ${amount.toLocaleString()}`;

export default function RecentAssignmentsTable({ data }: RecentAssignmentsTableProps) {
  const columns: Column<RecentAssignment>[] = [
    { key: "sn", label: "S.N.", visible: true, exportable: true },
    { key: "targetType", label: "Target Type", visible: true, exportable: true },
    { key: "targetName", label: "Target", visible: true, exportable: true },
    { key: "class", label: "Class", visible: true, exportable: true },
    { key: "section", label: "Section", visible: true, exportable: true },
    { key: "feeHead", label: "Fee Head", visible: true, exportable: true },
    {
      key: "amount",
      label: "Amount",
      visible: true,
      exportable: true,
      render: (row) => moneyFormatter(row.amount),
    },
    { key: "type", label: "Type", visible: true, exportable: true },
    { key: "month", label: "Month", visible: true, exportable: true },
    { key: "academicYear", label: "Academic Year", visible: true, exportable: true },
    { key: "assignedOn", label: "Assigned On", visible: true, exportable: true },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Recent Assignments</h3>
        <div className="text-xs text-slate-500 font-medium">History of assigned fees</div>
      </div>
      <div className="p-1">
        <CustomTable
          data={data}
          columns={columns}
          isLoading={false}
          caption="A list of recent fee assignment activity."
        />
      </div>
    </div>
  );
}
