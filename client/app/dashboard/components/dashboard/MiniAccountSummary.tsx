"use client";

import React from "react";
import { Wallet, AlertCircle, CalendarDays, CalendarRange } from "lucide-react";

interface MiniAccountSummaryProps {
  collections?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  pendingDues?: {
    amount: number;
    count: number;
  };
}

export default function MiniAccountSummary({
  collections,
  pendingDues,
}: MiniAccountSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Financial Quick Look</h3>
        <p className="text-sm text-gray-500">Summary snapshot</p>
      </div>

      {/* Scrollable Content Section - Fills available height */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
        {/* Daily Collection */}
        <div className="flex items-center gap-3 rounded-xl bg-green-50/50 p-2.5 border border-green-100/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 shrink-0">
            <Wallet className="h-4.5 w-4.5 text-green-600" />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="text-[11px] text-green-700 font-medium truncate">Daily Collection</span>
            <span className="text-lg font-bold text-gray-900 truncate">Rs. {collections?.daily?.toLocaleString() ?? "0"}</span>
          </div>
        </div>

        {/* Weekly Collection */}
        <div className="flex items-center gap-3 rounded-xl bg-blue-50/50 p-2.5 border border-blue-100/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 shrink-0">
            <CalendarDays className="h-4.5 w-4.5 text-blue-600" />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="text-[11px] text-blue-700 font-medium truncate">Weekly Collection</span>
            <span className="text-lg font-bold text-gray-900 truncate">Rs. {collections?.weekly?.toLocaleString() ?? "0"}</span>
          </div>
        </div>

        {/* Monthly Collection */}
        <div className="flex items-center gap-3 rounded-xl bg-purple-50/50 p-2.5 border border-purple-100/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 shrink-0">
            <CalendarRange className="h-4.5 w-4.5 text-purple-600" />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="text-[11px] text-purple-700 font-medium truncate">Monthly Collection</span>
            <span className="text-lg font-bold text-gray-900 truncate">Rs. {collections?.monthly?.toLocaleString() ?? "0"}</span>
          </div>
        </div>

        {/* Pending Summary */}
        <div className="flex items-center gap-3 rounded-xl bg-orange-50/50 p-2.5 border border-orange-100/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 shrink-0">
            <AlertCircle className="h-4.5 w-4.5 text-orange-600" />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="text-[11px] text-orange-700 font-medium truncate">Pending Dues</span>
            <span className="text-lg font-bold text-gray-900 truncate">Rs. {pendingDues?.amount?.toLocaleString() ?? "0"}</span>
          </div>
          <div className="text-[10px] font-bold text-orange-600 whitespace-nowrap">
            <span>{pendingDues?.count ?? 0} Defaulters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
