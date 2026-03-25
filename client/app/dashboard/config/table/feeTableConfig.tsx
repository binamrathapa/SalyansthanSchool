"use client";

import { Column } from "@/app/dashboard/components/dashboard/common/CustomTable";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface FeeRecord {
  sn: number;
  particulars: string;
  amount: number;
  scholarship: number;
  received: number;
  due: number;
  status: "Paid" | "Pending";
}

export const feeCollectionColumns = (
  activeTab: string,
  onCollect: (row: FeeRecord) => void
): Column<FeeRecord>[] => [
  { key: "sn", label: "SN" },

  { key: "particulars", label: "Particulars" },

  {
    key: "amount",
    label: "Amount",
    render: (row) => <div className="text-left">{row.amount}</div>,
  },

  {
    key: "scholarship",
    label: "Scholarship",
    render: (row) => <div className="text-left">{row.scholarship}</div>,
  },

  {
    key: "received",
    label: "Received",
    render: (row) => (
      <div className="text-left">
        {activeTab === "paid" ? row.amount : row.received}
      </div>
    ),
  },

  {
    key: "due",
    label: "Due",
    render: (row) => (
      <div className="text-left">
        {activeTab === "paid" ? 0 : row.due}
      </div>
    ),
  },

  {
    key: "actions",
    label: "Action",
    className: "text-center",
    render: (row) =>
      activeTab === "paid" ? (
        <span className="text-green-600 font-medium">Paid</span>
      ) : (
        <Button size="sm" onClick={() => onCollect(row)}>
          Collect
        </Button>
      ),
  },
];