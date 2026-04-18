"use client";

import React from "react";
import { Wallet, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";

interface MiniAccountSummaryProps {
  dailyCollection: {
    amount: number;
    trend: string;
  };
  pendingDues: {
    amount: number;
    count: number;
  };
  weeklyTrend: number[];
}

export default function MiniAccountSummary({
  dailyCollection,
  pendingDues,
  weeklyTrend,
}: MiniAccountSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Financial Quick Look</h3>
          <p className="text-sm text-gray-500">Today's snapshot</p>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
          View Accounts <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Collection Summary */}
        <div className="flex items-center gap-4 rounded-xl bg-green-50/50 p-4 border border-green-100/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Wallet className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-xs text-green-700 font-medium">Daily Collection</span>
            <span className="text-xl font-bold text-gray-900">Rs. {dailyCollection.amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>{dailyCollection.trend}</span>
          </div>
        </div>

        {/* Pending Summary */}
        <div className="flex items-center gap-4 rounded-xl bg-orange-50/50 p-4 border border-orange-100/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-xs text-orange-700 font-medium">Pending Dues</span>
            <span className="text-xl font-bold text-gray-900">Rs. {pendingDues.amount.toLocaleString()}</span>
          </div>
          <div className="text-xs font-medium text-orange-600">
            <span>{pendingDues.count} Defaulters</span>
          </div>
        </div>
      </div>

      {/* Mini Trend Line Mock */}
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>Weekly Trend</span>
          <span className="text-green-500">Positive</span>
        </div>
        <div className="flex h-8 items-end gap-1 px-1">
          {weeklyTrend.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-brand-200 transition-all hover:bg-brand-400"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
