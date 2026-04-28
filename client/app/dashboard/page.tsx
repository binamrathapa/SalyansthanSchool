"use client";

import React from "react";
import {
  Users,
  UserSquare2,
  GraduationCap
} from "lucide-react";
import StudentDistribution from "./components/dashboard/StudentDistribution";
import MiniAccountSummary from "./components/dashboard/MiniAccountSummary";
import { useGetDashboardData } from "@/server-action/api/dashboard.api";
import GlobalLoader from "./components/dashboard/common/GlobalLoader";
import "./dashboard.css";

const BRAND_GREEN = "var(--brand-700)";
const BRAND_SECONDARY = "var(--brand-secondary)";

const metricIcons: Record<string, React.ReactNode> = {
  students: <Users size={18} color="white" />,
  teachers: <UserSquare2 size={18} color="white" />,
  classes: <GraduationCap size={18} color="white" />,
};

export default function DashboardHome() {
  const { data: dashboardData, isLoading, error } = useGetDashboardData();

  if (isLoading) return <GlobalLoader />;
  if (error || !dashboardData) return <div>Error loading dashboard data</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      {/* Welcome Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          School Overview
        </h1>
        <p className="text-gray-500">
          Here's what's happening at Salyansthan School today.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardData.metrics.map((metric: any, index: number) => {
          const bg = index % 2 === 0 ? BRAND_GREEN : BRAND_SECONDARY;
          const icon = metricIcons[metric.id] ?? <Users size={18} color="white" />;
          return (
            <div
              key={metric.id}
              className="rounded-[20px] p-5 text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl cursor-default"
              style={{ background: bg }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-medium opacity-90">{metric.title}</span>
                <div className="bg-white/20 p-2 rounded-xl">
                  {icon}
                </div>
              </div>
              <div className="text-2xl font-extrabold tracking-tight mb-1">{metric.value}</div>
              {metric.description && (
                <div className="text-xs opacity-80">{metric.description}</div>
              )}
              {metric.trend && (
                <div className="text-xs opacity-80 mt-0.5">
                  {metric.trend.isPositive ? "↑" : "↓"} {Math.abs(metric.trend.value)}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StudentDistribution
            classData={dashboardData.charts.enrollment}
            genderData={dashboardData.charts.gender}
          />
        </div>
        <div className="lg:col-span-1">
          <MiniAccountSummary
            collections={dashboardData.financials.collections}
            pendingDues={dashboardData.financials.pendingDues}
          />
        </div>
      </div>
    </div>
  );
}
