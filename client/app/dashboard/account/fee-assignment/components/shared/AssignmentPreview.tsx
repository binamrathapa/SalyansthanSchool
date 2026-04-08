"use client";

import { User, Users, CalendarDays, Wallet, BadgeDollarSign, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssignmentPreviewProps {
  title: string;
  type: "individual" | "group" | "billing";
  targetName: string;
  subDetails: { label: string; value: string }[];
  selectedStructures: { id: number; feeHead: string; amount: number; type: string }[];
  totalAmount: number;
  onAssign: () => void;
  isPending?: boolean;
}

const moneyFormatter = (amount: number) => `Rs. ${amount.toLocaleString()}`;

export default function AssignmentPreview({
  title,
  type,
  targetName,
  subDetails,
  selectedStructures,
  totalAmount,
  onAssign,
  isPending
}: AssignmentPreviewProps) {
  const Icon = type === "individual" ? User : type === "group" ? Users : CalendarDays;
  const gradient = type === "individual" ? "from-blue-500 to-indigo-500" : type === "group" ? "from-green-500 to-emerald-500" : "from-amber-500 to-orange-500";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md shadow-blue-100`}>
            <Icon size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Preview</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 space-y-4 overflow-y-auto">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Target</span>
            <span className="font-bold text-slate-900">{targetName || "-"}</span>
          </div>
          {subDetails.map((detail, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{detail.label}</span>
              <span className="font-medium text-slate-700">{detail.value}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-900">Total Amount</span>
            <span className="text-lg font-extrabold text-blue-600">{moneyFormatter(totalAmount)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Included Structures</h5>
          {selectedStructures.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-xs text-slate-400 italic">No structures selected</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedStructures.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-800">{item.feeHead}</span>
                    <span className="text-sm font-bold text-slate-900">{moneyFormatter(item.amount)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">{item.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-slate-100 bg-slate-50/30">
        <Button
          onClick={onAssign}
          disabled={isPending || selectedStructures.length === 0 || !targetName}
          className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100 h-11 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isPending ? "Assigning..." : `Assign to ${type === "individual" ? "Student" : type === "group" ? "Group" : "Billing cycle"}`}
        </Button>
      </div>
    </div>
  );
}
