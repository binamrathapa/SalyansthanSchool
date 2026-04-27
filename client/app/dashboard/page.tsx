"use client";

import React from "react";
import {
  Users,
  UserSquare2,
  GraduationCap
} from "lucide-react";
import SummaryCard from "./components/dashboard/SummaryCard";
import StudentDistribution from "./components/dashboard/StudentDistribution";
import MiniAccountSummary from "./components/dashboard/MiniAccountSummary";
import { useGetDashboardData } from "@/server-action/api/dashboard.api";
import GlobalLoader from "./components/dashboard/common/GlobalLoader";
import "./dashboard.css";

const metricConfigs: Record<string, { icon: any; color: "blue" | "purple" | "green" | "orange" }> = {
  students: { icon: Users, color: "blue" },
  teachers: { icon: UserSquare2, color: "purple" },
  classes: { icon: GraduationCap, color: "green" },
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
        {dashboardData.metrics.map((metric: any) => {
          const config = metricConfigs[metric.id] || metricConfigs.students;
          return (
            <SummaryCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              icon={config.icon}
              description={metric.description}
              trend={metric.trend}
              color={config.color}
            />
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
