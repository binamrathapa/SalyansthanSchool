"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
  Receipt,
  RotateCcw,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";

import CustomTable, {
  Column,
} from "@/app/dashboard/components/dashboard/common/CustomTable";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import KpiCard from "./components/KpiCard";
import CustomTooltip from "./components/CustomTooltip";

import { Defaulter, Transaction } from "@/app/dashboard/types/finance.types";

const BRAND_GREEN = "var(--brand-700)";
const BRAND_SECONDARY = "var(--brand-secondary)";

import { useGetFinanceDashboard } from "@/server-action/api/finance.api";
import GlobalLoader from "../components/dashboard/common/GlobalLoader";

/* ------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------ */

type TimePeriod =
  | "Today"
  | "This Week"
  | "This Month"
  | "This Year"
  | "Previous Years";

type ClassFilter = "All Classes" | string;

interface BarChartFilter {
  period?: TimePeriod;
}

interface PieChartFilter {
  classFilter?: ClassFilter;
}

/* ------------------------------------------------ */
/* FILTER SELECT */
/* ------------------------------------------------ */

const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  value: string | number;
  onChange: (v: string) => void;
  options: (string | number)[];
  placeholder?: string;
  disabled?: boolean;
}) => (
  <div onClick={(e) => e.stopPropagation()}>
    <Select value={value.toString()} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="h-9 min-w-[130px] rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-200">
        <SelectValue placeholder={placeholder || "Select option"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option}
            value={option.toString()}
            className="text-xs font-medium"
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

/* ------------------------------------------------ */
/* PERIOD FILTER BAR */
/* ------------------------------------------------ */

const PeriodFilterBar = ({
  localFilter,
  onOverride,
}: {
  localFilter: BarChartFilter;
  onOverride: (f: BarChartFilter) => void;
}) => {
  const periods: TimePeriod[] = [
    "Today",
    "This Week",
    "This Month",
    "This Year",
    "Previous Years",
  ];

  const activePeriod = localFilter.period ?? "This Month";
  const isOverriding = Object.keys(localFilter).length > 0;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isOverriding && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOverride({});
          }}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}

      <FilterSelect
        value={activePeriod}
        onChange={(v) => onOverride({ period: v as TimePeriod })}
        options={periods}
        placeholder="Period"
      />
    </div>
  );
};

/* ------------------------------------------------ */
/* CLASS FILTER BAR */
/* ------------------------------------------------ */

const ClassFilterBar = ({
  localFilter,
  onOverride,
  classOptions,
}: {
  localFilter: PieChartFilter;
  onOverride: (f: PieChartFilter) => void;
  classOptions: string[];
}) => {
  const activeClass = localFilter.classFilter ?? "All Classes";
  const isOverriding = Object.keys(localFilter).length > 0;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isOverriding && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOverride({});
          }}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}

      <FilterSelect
        value={activeClass}
        onChange={(v) => onOverride({ classFilter: v })}
        options={["All Classes", ...classOptions]}
        placeholder="Class"
      />
    </div>
  );
};

/* ------------------------------------------------ */
/* MAIN DASHBOARD */
/* ------------------------------------------------ */

const FinanceOverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { data: financeDashboard, isLoading, error } = useGetFinanceDashboard(selectedYear);

  const [dailyFilter, setDailyFilter] = useState<BarChartFilter>({});
  const [pieFilter, setPieFilter] = useState<PieChartFilter>({});

  const classOptions = useMemo(() => {
    if (!financeDashboard) return [];
    return financeDashboard.classWiseFeeStatus.map((item) => item.class).sort();
  }, [financeDashboard]);

  const selectedClass = pieFilter.classFilter ?? "All Classes";

  const kpiData = useMemo(() => {
    if (!financeDashboard) return null;

    const { data, previousYearsAggregate } = financeDashboard;
    
    const totalDueAmount = data.defaulters.reduce((sum, item) => sum + item.dueAmount, 0);
    const thisMonthCollection = data.monthlyCollection.reduce((sum, item) => sum + item.amount, 0);
    const thisYearCollection = data.yearlyCollection.reduce((sum, item) => sum + item.amount, 0);
    
    const previousYearRecord = previousYearsAggregate.find(item => item.year === selectedYear - 1);
    const previousYearCollection = previousYearRecord?.totalCollection ?? 0;
    const growth = previousYearCollection > 0 
      ? ((thisYearCollection - previousYearCollection) / previousYearCollection) * 100 
      : 0;

    const latestWeeklyAmount = data.weeklyCollection.reduce((sum, item) => sum + item.amount, 0);
    const avgWeeklyAmount = data.weeklyCollection.length > 0 ? latestWeeklyAmount / data.weeklyCollection.length : 0;

    return {
      todayCollection: {
        value: `Rs.${data.todayCollection.amount.toLocaleString()}`,
        sub: data.todayCollection.status,
      },
      totalDue: {
        value: `Rs.${totalDueAmount.toLocaleString()}`,
        sub: "Outstanding dues",
      },
      yearCollection: {
        value: `Rs.${thisYearCollection.toLocaleString()}`,
        sub: `${growth >= 0 ? "↑" : "↓"} ${Math.abs(growth).toFixed(1)}% vs last year`,
      },
      monthCollection: {
        value: `Rs.${thisMonthCollection.toLocaleString()}`,
        sub: "Current month collection",
      },
      weeklyAverage: {
        value: `Rs.${Math.round(avgWeeklyAmount).toLocaleString()}`,
        sub: "Average daily this week",
      },
      transactionsCount: {
        value: data.latestestTrasaction.length.toString(),
        sub: "Latest transactions",
      },
    };
  }, [financeDashboard, selectedYear]);

  const filteredDailyData = useMemo(() => {
    if (!financeDashboard) return [];
    const { data, previousYearsAggregate } = financeDashboard;
    const period = dailyFilter.period ?? "This Month";

    if (period === "Today") {
      return [{ day: "Today", amount: data.todayCollection.amount }];
    }

    if (period === "This Week") {
      return data.weeklyCollection.map((d) => ({
        day: d.label,
        amount: d.amount,
      }));
    }

    if (period === "This Month") {
      return data.monthlyCollection.map((d) => ({
        day: d.label,
        amount: d.amount,
      }));
    }

    if (period === "This Year") {
      return data.yearlyCollection.map((d) => ({
        day: d.label,
        amount: d.amount,
      }));
    }

    if (period === "Previous Years") {
      return previousYearsAggregate.map((d) => ({
        day: d.year.toString(),
        amount: d.totalCollection,
      }));
    }

    return [];
  }, [dailyFilter, financeDashboard]);

  const defaulterColumns: Column<any>[] = [
    { key: "sn", label: "S.N.", exportable: true, visible: true },
    { key: "id", label: "Student ID", exportable: true, visible: true },
    { key: "name", label: "Name", exportable: true, visible: true },
    { key: "class", label: "Class", exportable: true, visible: true },
    {
      key: "dueAmount",
      label: "Due Amount",
      exportable: true,
      visible: true,
      cellClassName: "font-bold text-rose-500",
      render: (row) => `Rs. ${row.dueAmount.toLocaleString()}`,
    },
    {
      key: "contact",
      label: "Contact",
      exportable: true,
      visible: true,
    },
    {
      key: "status",
      label: "Status",
      exportable: true,
      visible: true,
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "Unpaid"
              ? "bg-rose-50 text-rose-500"
              : "bg-amber-50 text-amber-500"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const transactionColumns: Column<any>[] = [
    { key: "sn", label: "S.N.", exportable: true, visible: true },
    { key: "receipt", label: "Receipt No.", exportable: true, visible: true },
    { key: "student", label: "Student", exportable: true, visible: true },
    { key: "class", label: "Class", exportable: true, visible: true },
    {
      key: "amount",
      label: "Amount",
      exportable: true,
      visible: true,
      cellClassName: "font-bold text-green-500",
      render: (row) => `Rs. ${row.amount.toLocaleString()}`,
    },
    { key: "date", label: "Date", exportable: true, visible: true },
    { key: "method", label: "Method", exportable: true, visible: true },
    {
      key: "status",
      label: "Status",
      exportable: true,
      visible: true,
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "Success"
              ? "bg-green-100 text-green-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const paidUnpaidPieData = useMemo(() => {
    if (!financeDashboard) return [];
    const { classWiseFeeStatus } = financeDashboard;

    if (selectedClass === "All Classes") {
      const totalPaid = classWiseFeeStatus.reduce(
        (sum, item) => sum + item.paidAmount,
        0
      );

      const totalUnpaid = classWiseFeeStatus.reduce(
        (sum, item) => sum + item.unpaidAmount,
        0
      );

      return [
        { name: "Paid", value: totalPaid, fill: BRAND_GREEN },
        { name: "Unpaid", value: totalUnpaid, fill: BRAND_SECONDARY },
      ];
    }

    const selectedClassData = classWiseFeeStatus.find(
      (item) => item.class === selectedClass
    );

    return [
      {
        name: "Paid",
        value: selectedClassData?.paidAmount ?? 0,
        fill: BRAND_GREEN,
      },
      {
        name: "Unpaid",
        value: selectedClassData?.unpaidAmount ?? 0,
        fill: BRAND_SECONDARY,
      },
    ];
  }, [selectedClass, financeDashboard]);

  const pieTotal = paidUnpaidPieData.reduce((sum, item) => sum + (item.value as number), 0);

  const peakAmount =
    filteredDailyData.length > 0
      ? Math.max(...filteredDailyData.map((d) => d.amount))
      : 0;

  if (isLoading) return <GlobalLoader />;
  if (error || !financeDashboard) return <div>Error loading financial data</div>;

  return (
    <div className="p-7 md:p-8 min-h-screen font-['Plus_Jakarta_Sans','Segoe_UI',sans-serif]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");
        .chart-card {
          transition: all 0.2s ease;
          cursor: default;
        }
        .chart-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -10px rgba(34, 197, 94, 0.15) !important;
        }
      `}</style>

      <div className="flex flex-wrap justify-between items-center gap-3.5 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
            Finance Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time financial snapshot
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session</span>
          <FilterSelect
            value={selectedYear}
            onChange={(v) => setSelectedYear(parseInt(v))}
            options={financeDashboard.availableYears}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-3.5">
        <KpiCard
          title="Today's Collection"
          value={kpiData!.todayCollection.value}
          icon={<Wallet size={18} color="white" />}
          gradient={BRAND_GREEN}
          sub={kpiData!.todayCollection.sub}
        />

        <KpiCard
          title="Total Due"
          value={kpiData!.totalDue.value}
          icon={<TrendingDown size={18} color="white" />}
          gradient={BRAND_SECONDARY}
          sub={kpiData!.totalDue.sub}
        />

        <KpiCard
          title="Year Collection"
          value={kpiData!.yearCollection.value}
          icon={<TrendingUp size={18} color="white" />}
          gradient={BRAND_GREEN}
          sub={kpiData!.yearCollection.sub}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
        <KpiCard
          title="This Month Collection"
          value={kpiData!.monthCollection.value}
          icon={<TrendingUp size={18} color="white" />}
          gradient={BRAND_SECONDARY}
          sub={kpiData!.monthCollection.sub}
        />

        <KpiCard
          title="Weekly Average"
          value={kpiData!.weeklyAverage.value}
          icon={<Activity size={18} color="white" />}
          gradient={BRAND_GREEN}
          sub={kpiData!.weeklyAverage.sub}
        />

        <KpiCard
          title="Recent Transactions"
          value={kpiData!.transactionsCount.value}
          icon={<Receipt size={18} color="white" />}
          gradient={BRAND_SECONDARY}
          sub={kpiData!.transactionsCount.sub}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5 mb-4.5">
        <div className="chart-card bg-white rounded-2xl p-4.5 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-0.5 h-4 bg-blue-500 rounded"></span>
              Collection Report
            </h2>

            <PeriodFilterBar
              localFilter={dailyFilter}
              onOverride={setDailyFilter}
            />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filteredDailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `Rs. ${v / 1000}K`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(34,197,94,0.04)" }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {filteredDailyData.map((entry, index) => (
                    <Cell
                      key={`bar-cell-${index}`}
                      fill={entry.amount === peakAmount ? BRAND_SECONDARY : BRAND_GREEN}
                    />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card bg-white rounded-2xl p-4.5 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-0.5 h-4 bg-rose-500 rounded"></span>
              Paid vs Unpaid Amount
              <span className="text-xs font-medium text-slate-400">
                ({selectedClass})
              </span>
            </h2>

            <ClassFilterBar
              localFilter={pieFilter}
              onOverride={setPieFilter}
              classOptions={classOptions}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="60%" height={260}>
              <PieChart key={selectedClass}>
                <Pie
                  key={`pie-${selectedClass}`}
                  data={paidUnpaidPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={90}
                  paddingAngle={1}
                  stroke="none"
                  isAnimationActive
                >
                  {paidUnpaidPieData.map((entry, index) => (
                    <Cell
                      key={`${selectedClass}-${entry.name}-${index}`}
                      fill={entry.fill}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="w-full sm:w-2/5">
              <div className="mb-3 text-center">
                <p className="text-xl font-extrabold text-slate-900 leading-tight">
                  Rs. {pieTotal.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">{selectedClass}</p>
              </div>

              <div className="space-y-2">
                {paidUnpaidPieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-slate-600 font-medium">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-bold text-slate-900">
                        Rs. {item.value.toLocaleString()}
                      </span>
                      <span className="text-slate-400 w-10 text-right">
                        {pieTotal > 0
                          ? (((item.value as number) / pieTotal) * 100).toFixed(0)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
                Collected amount is based on class-wise fee status summary.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-4.5 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Defaulters List
          </h3>

          <CustomTable
            caption="List of students with pending fees"
            columns={defaulterColumns}
            data={financeDashboard.data.defaulters}
            limit={5}
            showDelete
            onDelete={() => {}}
            searchableKeys={["name", "id", "class"]}
            filterOptions={[
              { label: "Unpaid", value: "Unpaid", key: "status" },
              { label: "Partial", value: "Partial", key: "status" },
            ]}
          />
        </div>

        <div className="bg-white rounded-2xl p-4.5 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Recent Fee Transactions
          </h3>

          <CustomTable
            caption="Recent fee transactions"
            columns={transactionColumns}
            data={financeDashboard.data.latestestTrasaction}
            limit={5}
            onDelete={() => {}}
            searchableKeys={["receipt", "student", "class", "method"]}
            filterOptions={[
              { label: "Cash", value: "Cash", key: "method" },
              { label: "Online", value: "Online", key: "method" },
              { label: "Bank Transfer", value: "Bank Transfer", key: "method" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceOverviewDashboard;