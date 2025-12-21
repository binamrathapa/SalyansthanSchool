"use client";

import { useState } from "react";
import { Wallet, CreditCard, AlertCircle, Plus, Search,User } from "lucide-react";
import { SummaryCard } from "@/app/dashboard/account/cash-counter/components/SummaryCard";


const feeTabs = [
  { key: "remaining", label: "Remaining Fees" },
  { key: "paid", label: "Paid Fees" },
  { key: "assigned", label: "Assigned Fees" },
  { key: "bill", label: "Bill & Receipt" },
  { key: "cancelled", label: "Cancelled Bill" },
  { key: "advance", label: "Advance" },
  { key: "misc", label: "Misc" },
  { key: "status", label: "Status" },
];


export default function FeeCollectionPage() {
  const [activeTab, setActiveTab] = useState("remaining");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fee Collection</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm">
          <Plus className="h-4 w-4" /> Add Particulars
        </button>
      </div>

     

      {/* Student + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Card */}
        <div className="rounded-2xl border p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-10 w-10 text-gray-500" />
            </div>
            <div>
              <h2 className="font-semibold">Debika Shrestha</h2>
              <p className="text-sm text-gray-600">
                Bachelor of Business Studies (4 Yrs)
              </p>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>SGI No</span>
              <span>5842</span>
            </div>
            <div className="flex justify-between">
              <span>Batch</span>
              <span>2082</span>
            </div>
            <div className="flex justify-between">
              <span>Semester</span>
              <span>1st Year</span>
            </div>
            <div className="flex justify-between">
              <span>Section</span>
              <span>A</span>
            </div>
            <div className="flex justify-between">
              <span>Roll No</span>
              <span>91</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Total" amount="29,300" icon={Wallet} />
          <SummaryCard title="Remaining" amount="10,000" icon={AlertCircle} />
          <SummaryCard title="Online Advance" amount="0" icon={CreditCard} />
          <SummaryCard title="Late" amount="0" icon={AlertCircle} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {feeTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm rounded-t-lg border-b-2 transition ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Header Actions */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm">
          <Plus className="h-4 w-4" /> Add Particulars
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            className="pl-9 pr-4 py-2 border rounded-xl text-sm"
            placeholder="Search records"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">SN</th>
              <th className="p-3 text-left">Particulars</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-right">Scholarship</th>
              <th className="p-3 text-right">Received</th>
              <th className="p-3 text-right">Due</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{i}</td>
                <td className="p-3">Monthly Fee</td>
                <td className="p-3 text-right">12,000</td>
                <td className="p-3 text-right">0</td>
                <td className="p-3 text-right">
                  {activeTab === "paid" ? "12,000" : "2,000"}
                </td>
                <td className="p-3 text-right">
                  {activeTab === "paid" ? "0" : "10,000"}
                </td>
                <td className="p-3 text-center">
                  {activeTab === "paid" ? (
                    <span className="text-green-600 font-medium">Paid</span>
                  ) : (
                    <button className="text-blue-600 hover:underline">
                      Collect
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
