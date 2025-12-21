"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Download, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const dailyCollectionData = [
  { date: "Mon", amount: 25000 },
  { date: "Tue", amount: 18000 },
  { date: "Wed", amount: 32000 },
  { date: "Thu", amount: 15000 },
  { date: "Fri", amount: 40000 },
];

const dueReportData = [
  { name: "Paid", value: 70 },
  { name: "Due", value: 30 },
];

const incomeExpenseData = [
  { month: "Jan", income: 120000, expense: 80000 },
  { month: "Feb", income: 150000, expense: 95000 },
  { month: "Mar", income: 170000, expense: 110000 },
];

export default function FinanceOverviewDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Finance Overview</h1>
        <div className="flex items-center gap-3">
          {/* Time Period Filter */}
          <select className="border rounded-xl px-3 py-2 text-sm bg-white">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
            <option>Custom Range</option>
          </select>
          <button className="flex items-center gap-2 border px-4 py-2 rounded-xl text-sm">
            <Download className="h-4 w-4" /> Export Summary
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Today Collection"
          value="Rs. 40,000"
          icon={<Wallet className="h-5 w-5" />}
        />
        <KpiCard
          title="Total Due"
          value="Rs. 75,000"
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
        />
        <KpiCard
          title="Net Income"
          value="Rs. 60,000"
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
        />
      </div>

      {/* Monthly Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="This Month Collection"
          value="Rs. 3,20,000"
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          title="This Month Due"
          value="Rs. 1,10,000"
          icon={<TrendingDown className="h-5 w-5 text-orange-500" />}
        />
        <KpiCard
          title="Scholarship Given"
          value="Rs. 85,000"
          icon={<Wallet className="h-5 w-5 text-purple-500" />}
        />
        <KpiCard
          title="Monthly Expense"
          value="Rs. 2,10,000"
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Collection Report */}
        <Card className="rounded-2xl shadow-md border-0 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Daily Collection Report</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyCollectionData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Due Report */}
        <Card className="rounded-2xl shadow-md border-0 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Due Report</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dueReportData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                >
                  {dueReportData.map((_, idx) => (
                    <Cell key={idx} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income vs Expense */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Income vs Expense</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeExpenseData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="income" />
                <Line dataKey="expense" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Export */}
      <Card className="rounded-2xl shadow-md border-0 bg-white/90 backdrop-blur">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Ledger Export</h2>
            <p className="text-sm text-gray-600">
              Export ledgers for audit and accounting
            </p>
          </div>
          <button className="border px-4 py-2 rounded-xl text-sm flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Ledger
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// KPI Card with color accent
function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl shadow-md border-0 bg-white/90 backdrop-blur">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}
